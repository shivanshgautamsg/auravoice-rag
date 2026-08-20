"""
Resilience Harness: Exponential Backoff Retries, Circuit Breaker Pattern, and Failure Recovery.
"""

import time
import asyncio
import random
from typing import Callable, Any, Optional
import logging

logger = logging.getLogger(__name__)

class CircuitBreakerOpenException(Exception):
    pass

class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, recovery_timeout_sec: float = 10.0):
        self.failure_threshold = failure_threshold
        self.recovery_timeout_sec = recovery_timeout_sec
        self.failure_count = 0
        self.last_failure_time = 0.0
        self.state = "CLOSED"  # "CLOSED", "OPEN", "HALF-OPEN"

    def record_success(self):
        self.failure_count = 0
        self.state = "CLOSED"

    def record_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
            logger.warning(f"Circuit Breaker tripped to OPEN after {self.failure_count} failures.")

    def allow_execution(self) -> bool:
        if self.state == "CLOSED":
            return True
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.recovery_timeout_sec:
                self.state = "HALF-OPEN"
                logger.info("Circuit Breaker transitioned to HALF-OPEN for trial execution.")
                return True
            return False
        if self.state == "HALF-OPEN":
            return True
        return True


async def resilient_execute(
    func: Callable[..., Any],
    *args,
    max_retries: int = 3,
    base_delay: float = 0.05,
    circuit_breaker: Optional[CircuitBreaker] = None,
    fallback_func: Optional[Callable[..., Any]] = None,
    **kwargs
) -> Any:
    """
    Executes an async or sync function inside a resilient harness with retries, exponential backoff, and circuit breaker.
    """
    cb = circuit_breaker
    if cb and not cb.allow_execution():
        logger.error("Circuit breaker is OPEN. Attempting fallback execution.")
        if fallback_func:
            return await _invoke(fallback_func, *args, **kwargs)
        raise CircuitBreakerOpenException("Circuit breaker is active; request throttled.")

    retries = 0
    last_exception = None

    while retries <= max_retries:
        try:
            result = await _invoke(func, *args, **kwargs)
            if cb:
                cb.record_success()
            return result
        except Exception as e:
            last_exception = e
            retries += 1
            if cb:
                cb.record_failure()

            if retries > max_retries:
                logger.error(f"Execution failed after {max_retries} retries: {str(e)}")
                if fallback_func:
                    logger.info("Triggering fallback function.")
                    return await _invoke(fallback_func, *args, **kwargs)
                raise last_exception

            # Exponential backoff with jitter
            delay = base_delay * (2 ** (retries - 1)) + random.uniform(0.01, 0.03)
            logger.warning(f"Retry {retries}/{max_retries} after error: {str(e)}. Backoff delay: {delay*1000:.1f}ms")
            await asyncio.sleep(delay)

async def _invoke(fn: Callable[..., Any], *args, **kwargs) -> Any:
    if asyncio.iscoroutinefunction(fn):
        return await fn(*args, **kwargs)
    else:
        return fn(*args, **kwargs)

# Global default circuit breaker for LLM / external services
global_circuit_breaker = CircuitBreaker()
