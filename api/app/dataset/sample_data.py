"""
Curated representative samples from ai4bharat/MSMARCO-XI dataset.
Cross-lingual query-passage pairs covering English, Hindi, Bengali, Tamil, Telugu, and Marathi.
"""

MSMARCO_XI_SAMPLES = [
    {
        "id": "msmarco_xi_001",
        "doc_id": "doc_chandrayaan3_01",
        "title": "Chandrayaan-3 Lunar Mission",
        "language": "en",
        "domain": "Space Science & Technology",
        "passage": (
            "Chandrayaan-3 is the third lunar exploration mission developed by the Indian Space Research Organisation (ISRO). "
            "It was launched on 14 July 2023 from Satish Dhawan Space Centre in Sriharikota, Andhra Pradesh. "
            "The mission consisted of a lunar lander named Vikram and a lunar rover named Pragyan. "
            "On 23 August 2023, the Vikram lander successfully executed a soft landing near the lunar south pole region at 18:04 IST. "
            "This historic achievement made India the fourth country to successfully land on the Moon and the first country to land near the lunar south polar region."
        ),
        "queries": [
            {"query": "When did Chandrayaan-3 land on the Moon?", "language": "en", "answerable": True},
            {"query": "What are the names of the lander and rover in Chandrayaan-3?", "language": "en", "answerable": True},
            {"query": "चंद्रयान-3 कब लॉन्च हुआ था?", "language": "hi", "answerable": True},
            {"query": "Who is the Prime Minister of Moon?", "language": "en", "answerable": False}
        ]
    },
    {
        "id": "msmarco_xi_002",
        "doc_id": "doc_ayurveda_02",
        "title": "Traditional Indian Medicine: Ayurveda",
        "language": "en",
        "domain": "Healthcare & Medicine",
        "passage": (
            "Ayurveda is an ancient Indian system of holistic medicine developed over 3,000 years ago. "
            "It is based on the philosophical principle that health and wellness depend on a delicate balance between mind, body, and spirit. "
            "The foundational theory revolves around three fundamental biological energies known as Doshas: Vata (space and air), Pitta (fire and water), and Kapha (water and earth). "
            "Treatment methodologies in Ayurveda emphasize preventive care through dietary regimens, herbal remedies, yoga, meditation, and Panchakarma detoxification processes."
        ),
        "queries": [
            {"query": "What are the three doshas in Ayurveda?", "language": "en", "answerable": True},
            {"query": "आयुर्वेद में तीन दोष कौन से हैं?", "language": "hi", "answerable": True},
            {"query": "What is the primary treatment in Ayurveda?", "language": "en", "answerable": True},
            {"query": "How to build a quantum computer using Ayurveda?", "language": "en", "answerable": False}
        ]
    },
    {
        "id": "msmarco_xi_003",
        "doc_id": "doc_western_ghats_03",
        "title": "Biodiversity of the Western Ghats (Sahyadri)",
        "language": "en",
        "domain": "Ecology & Geography",
        "passage": (
            "The Western Ghats, also known as the Sahyadri mountain range, stretch 1,600 kilometers along the western coast of India across Gujarat, Maharashtra, Goa, Karnataka, Kerala, and Tamil Nadu. "
            "Recognized as a UNESCO World Heritage site, it is one of the world's eight 'hottest hotspots' of biological diversity. "
            "The region is home to over 7,402 species of flowering plants, 1,814 species of non-flowering plants, 139 mammal species, 508 bird species, 179 amphibian species, and 6,000 insect species. "
            "It plays an indispensable role in intercepting the southwest monsoon winds and recharging major peninsular rivers including the Godavari, Krishna, and Kaveri."
        ),
        "queries": [
            {"query": "Which states do the Western Ghats pass through?", "language": "en", "answerable": True},
            {"query": "পশ্চিমঘাট পর্বতমালা কোন কোন রাজ্যের মধ্যে বিস্তৃত?", "language": "bn", "answerable": True},
            {"query": "पश्चिमी घाट किन राज्यों से गुजरते हैं?", "language": "hi", "answerable": True},
            {"query": "How many species of mammals live in the Sahara desert?", "language": "en", "answerable": False}
        ]
    },
    {
        "id": "msmarco_xi_004",
        "doc_id": "doc_upi_payments_04",
        "title": "Unified Payments Interface (UPI) Architecture",
        "language": "en",
        "domain": "Fintech & Banking",
        "passage": (
            "The Unified Payments Interface (UPI) is a real-time instant payment system developed by the National Payments Corporation of India (NPCI). "
            "Launched in April 2016, UPI merges multiple banking services, seamless fund routing, and merchant payments into a single mobile application. "
            "It facilitates inter-bank peer-to-peer (P2P) and person-to-merchant (P2M) transactions instantly 24/7 without requiring sensitive bank account numbers or IFSC codes, using a unique Virtual Payment Address (VPA). "
            "Security is enforced through two-factor authentication including MPIN and device binding, processing over 13 billion transactions monthly."
        ),
        "queries": [
            {"query": "Who developed the Unified Payments Interface (UPI)?", "language": "en", "answerable": True},
            {"query": "यूपीआई को किसने विकसित किया है?", "language": "hi", "answerable": True},
            {"query": "What security mechanism is used by UPI?", "language": "en", "answerable": True},
            {"query": "Can UPI be used to travel to Mars?", "language": "en", "answerable": False}
        ]
    },
    {
        "id": "msmarco_xi_005",
        "doc_id": "doc_renewable_energy_05",
        "title": "India's Solar and Renewable Energy Revolution",
        "language": "en",
        "domain": "Energy & Sustainability",
        "passage": (
            "India has set an ambitious target of achieving 500 GW of non-fossil fuel energy capacity by the year 2030, in line with its COP26 climate commitments. "
            "The Bhadla Solar Park in Rajasthan is one of the largest solar parks in the world, spanning over 14,000 acres with an operational capacity exceeding 2,245 MW. "
            "Solar power in India has achieved grid parity, with tariffs falling below 2.50 INR per kilowatt-hour, making clean solar energy cheaper than conventional thermal coal power. "
            "The National Green Hydrogen Mission was launched in 2023 to position India as a global manufacturing and export hub for green hydrogen and green ammonia."
        ),
        "queries": [
            {"query": "What is India's non-fossil energy target for 2030?", "language": "en", "answerable": True},
            {"query": "भादला सोलर पार्क कहाँ स्थित है और इसकी क्षमता क्या है?", "language": "hi", "answerable": True},
            {"query": "Where is the Bhadla Solar Park located?", "language": "en", "answerable": True},
            {"query": "Explain how to bake a chocolate cake using solar ovens", "language": "en", "answerable": False}
        ]
    },
    {
        "id": "msmarco_xi_006",
        "doc_id": "doc_indus_valley_06",
        "title": "Harappan Architecture and Indus Valley Urban Planning",
        "language": "en",
        "domain": "History & Archaeology",
        "passage": (
            "The Indus Valley Civilization (also known as the Harappan Civilization) flourished around 2500 BCE to 1900 BCE along the basins of the Indus River. "
            "Its cities, including Mohenjo-daro, Harappa, Dholavira, and Rakhigarhi, are renowned for their sophisticated urban planning and grid-iron street layouts. "
            "Buildings were constructed with standardized kiln-fired bricks with a consistent dimensional ratio of 4:2:1. "
            "The civilization featured the world's first known advanced sanitation and closed drainage systems, with household drains connecting to covered public street drains equipped with inspection manholes."
        ),
        "queries": [
            {"query": "What was the standardized brick ratio in the Indus Valley Civilization?", "language": "en", "answerable": True},
            {"query": "सिंधु घाटी सभ्यता में जल निकासी व्यवस्था की क्या विशेषताएं थीं?", "language": "hi", "answerable": True},
            {"query": "What are the major cities of the Harappan Civilization?", "language": "en", "answerable": True},
            {"query": "Who invented the iPhone during the Harappan period?", "language": "en", "answerable": False}
        ]
    },
    {
        "id": "msmarco_xi_007",
        "doc_id": "doc_quantum_computing_07",
        "title": "Quantum Computing Fundamentals: Qubits and Superposition",
        "language": "en",
        "domain": "Computer Science & Quantum Physics",
        "passage": (
            "Quantum computing harnesses the fundamental laws of quantum mechanics to solve computational problems intractable for classical computers. "
            "While classical computers manipulate binary bits representing either 0 or 1, quantum computers process quantum bits (qubits). "
            "Due to quantum superposition, a qubit can exist simultaneously in a linear combination of states |0⟩ and |1⟩ until measured. "
            "Quantum entanglement enables qubits to correlate instantaneously across space, allowing algorithms like Shor's algorithm for prime factorization and Grover's algorithm for database search to achieve exponential and quadratic speedups."
        ),
        "queries": [
            {"query": "How does a qubit differ from a classical bit?", "language": "en", "answerable": True},
            {"query": "ക്വാണ്ടം കമ്പ്യூട്ടിംഗിൽ ക്യൂബിറ്റിന്റെ പ്രത്യേകത എന്താണ്?", "language": "ml", "answerable": True},
            {"query": "What is Grover's algorithm used for in quantum computing?", "language": "en", "answerable": True},
            {"query": "How to make instant samosas using quantum entanglement?", "language": "en", "answerable": False}
        ]
    },
    {
        "id": "msmarco_xi_008",
        "doc_id": "doc_bengal_renaissance_08",
        "title": "The Bengal Renaissance and Rabindranath Tagore",
        "language": "en",
        "domain": "Literature & Culture",
        "passage": (
            "The Bengal Renaissance was a cultural, intellectual, and scientific movement in the Bengal region during the 19th and early 20th centuries. "
            "Rabindranath Tagore was a polymath who reshaped Bengali literature, music, and art. "
            "In 1913, Tagore became the first non-European to win the Nobel Prize in Literature for his poetry collection 'Gitanjali'. "
            "He composed the national anthems of two sovereign nations: 'Jana Gana Mana' for India and 'Amar Shonar Bangla' for Bangladesh. "
            "Tagore also established the experimental educational institution Visva-Bharati University in Santiniketan."
        ),
        "queries": [
            {"query": "Why did Rabindranath Tagore win the Nobel Prize in 1913?", "language": "en", "answerable": True},
            {"query": "রবীন্দ্রনাথ ঠাকুর কোন কাব্যগ্রন্থের জন্য নোবেল পুরস্কার পেয়েছিলেন?", "language": "bn", "answerable": True},
            {"query": "Which two national anthems did Rabindranath Tagore compose?", "language": "en", "answerable": True},
            {"query": "Did Tagore play in the 2022 FIFA World Cup?", "language": "en", "answerable": False}
        ]
    },
    {
        "id": "msmarco_xi_009",
        "doc_id": "doc_tamil_sangam_09",
        "title": "Classical Tamil Literature and Sangam Era",
        "language": "en",
        "domain": "Classical Languages & History",
        "passage": (
            "Sangam literature represents the earliest known classical Tamil literature composed between 300 BCE and 300 CE across three mythical assemblies (Sangams) in ancient Tamil Nadu. "
            "The corpus includes the Eight Anthologies (Ettuthokai) and Ten Idylls (Pattuppattu), focusing on themes of love (Akam) and heroism or war (Puram). "
            "The masterwork 'Tirukkural', composed by poet-philosopher Thiruvalluvar, consists of 1,330 couplets divided into three sections: Aram (Virtue), Porul (Wealth), and Inbam (Love). "
            "Tamil was recognized as the first official Classical Language of India in 2004 due to its antiquity and rich independent literary tradition."
        ),
        "queries": [
            {"query": "What are the three sections of Tirukkural?", "language": "en", "answerable": True},
            {"query": "திருக்குறளை இயற்றியவர் யார்?", "language": "ta", "answerable": True},
            {"query": "When was Tamil recognized as a Classical Language of India?", "language": "en", "answerable": True},
            {"query": "How to repair a carburetor using Tirukkural?", "language": "en", "answerable": False}
        ]
    },
    {
        "id": "msmarco_xi_010",
        "doc_id": "doc_genai_transformers_10",
        "title": "Transformer Neural Network Architecture and Attention Mechanisms",
        "language": "en",
        "domain": "Artificial Intelligence & Deep Learning",
        "passage": (
            "The Transformer architecture, introduced by Vaswani et al. in the landmark 2017 paper 'Attention Is All You Need', revolutionized Natural Language Processing and generative AI. "
            "Departing from recurrent neural networks (RNNs) and LSTMs, Transformers rely entirely on the Scaled Dot-Product Attention mechanism and Multi-Head Attention. "
            "Self-attention allows the model to compute relational dependencies between all token positions in a sequence in parallel, eliminating sequential bottlenecks. "
            "Modern Large Language Models (LLMs) such as GPT-4, LLaMA, and Gemini are built upon decoder-only or encoder-decoder variations of this core transformer backbone."
        ),
        "queries": [
            {"query": "What mechanism does the Transformer architecture rely on?", "language": "en", "answerable": True},
            {"query": "ट्रांसफॉर्मर आर्किटेक्चर किस पेपर में पेश किया गया था?", "language": "hi", "answerable": True},
            {"query": "What are the advantages of self-attention over RNNs?", "language": "en", "answerable": True},
            {"query": "Can transformers cook biryani in a pressure cooker?", "language": "en", "answerable": False}
        ]
    }
]
