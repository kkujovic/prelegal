from dataclasses import dataclass, field


@dataclass
class FieldConfig:
    key: str
    label: str
    description: str
    default: str = ""


@dataclass
class DocumentConfig:
    name: str
    description: str
    fields: list[FieldConfig]


DOCUMENT_CONFIGS: dict[str, DocumentConfig] = {
    "Mutual NDA": DocumentConfig(
        name="Mutual Non-Disclosure Agreement",
        description="Protects confidential information shared between two parties.",
        fields=[
            FieldConfig("purpose", "Purpose", "How the parties intend to use each other's confidential information",
                        "Evaluating whether to enter into a business relationship with the other party."),
            FieldConfig("effectiveDate", "Effective Date", "When the agreement starts (YYYY-MM-DD format)"),
            FieldConfig("mndaTermType", "MNDA Term Type", "'fixed' (expires after N years) or 'indefinite' (continues until terminated)", "fixed"),
            FieldConfig("mndaTermYears", "MNDA Term Years", "Number of years (1-10) if mndaTermType is 'fixed'", "1"),
            FieldConfig("confidentialityTermType", "Confidentiality Term Type", "'fixed' (protected for N years) or 'perpetual' (protected forever)", "fixed"),
            FieldConfig("confidentialityTermYears", "Confidentiality Term Years", "Number of years (1-10) if confidentialityTermType is 'fixed'", "1"),
            FieldConfig("governingLaw", "Governing Law", "The US state whose laws govern the agreement (e.g. Delaware)"),
            FieldConfig("jurisdiction", "Jurisdiction", "The courts where disputes are resolved (e.g. courts in New Castle County, Delaware)"),
            FieldConfig("party1Company", "Party 1 Company", "First party's legal company name"),
            FieldConfig("party1Name", "Party 1 Name", "First party's signatory name"),
            FieldConfig("party1Title", "Party 1 Title", "First party's signatory title"),
            FieldConfig("party1Contact", "Party 1 Notice Address", "First party's contact/notice address"),
            FieldConfig("party2Company", "Party 2 Company", "Second party's legal company name"),
            FieldConfig("party2Name", "Party 2 Name", "Second party's signatory name"),
            FieldConfig("party2Title", "Party 2 Title", "Second party's signatory title"),
            FieldConfig("party2Contact", "Party 2 Notice Address", "Second party's contact/notice address"),
        ],
    ),

    "Cloud Service Agreement": DocumentConfig(
        name="Cloud Service Agreement",
        description="Governs the provision of cloud-based software services to customers.",
        fields=[
            FieldConfig("customer", "Customer", "Legal name of the customer company"),
            FieldConfig("provider", "Provider", "Legal name of the service provider company"),
            FieldConfig("effectiveDate", "Effective Date", "Agreement start date (YYYY-MM-DD)"),
            FieldConfig("governingLaw", "Governing Law", "US state whose laws govern the agreement"),
            FieldConfig("chosenCourts", "Chosen Courts", "Courts for dispute resolution (e.g. courts in Delaware)"),
            FieldConfig("generalCapAmount", "General Cap Amount", "General liability cap (e.g. fees paid in prior 12 months)"),
            FieldConfig("increasedClaims", "Increased Claims", "Claim types subject to a higher cap (e.g. IP infringement, breach of confidentiality)"),
            FieldConfig("increasedCapAmount", "Increased Cap Amount", "Liability cap for increased-cap claims"),
            FieldConfig("unlimitedClaims", "Unlimited Claims", "Claim types with no liability cap (e.g. fraud, gross negligence)"),
            FieldConfig("subscriptionPeriod", "Subscription Period", "Duration of the subscription (e.g. 1 year from Order Date)"),
            FieldConfig("paymentProcess", "Payment Process", "How and when payments are made"),
            FieldConfig("technicalSupport", "Technical Support", "Support tier and response commitments"),
            FieldConfig("useLimitations", "Use Limitations", "Restrictions on how the service may be used"),
            FieldConfig("scheduledDowntime", "Scheduled Downtime", "Planned maintenance windows excluded from SLAs"),
        ],
    ),

    "Design Partner Agreement": DocumentConfig(
        name="Design Partner Agreement",
        description="For early-stage customer relationships involving product feedback and co-development.",
        fields=[
            FieldConfig("partner", "Partner", "Legal name of the design partner company"),
            FieldConfig("provider", "Provider", "Legal name of the product/service provider company"),
            FieldConfig("effectiveDate", "Effective Date", "Agreement start date (YYYY-MM-DD)"),
            FieldConfig("term", "Term", "Duration of the agreement (e.g. 1 year)"),
            FieldConfig("fees", "Fees", "Any fees payable, or 'None' if no fees"),
            FieldConfig("program", "Program", "Description of the design partner program and expected engagement"),
            FieldConfig("governingLaw", "Governing Law", "US state whose laws govern the agreement"),
            FieldConfig("chosenCourts", "Chosen Courts", "Courts for dispute resolution"),
            FieldConfig("noticeAddress", "Notice Address", "Contact address for formal notices"),
        ],
    ),

    "Service Level Agreement": DocumentConfig(
        name="Service Level Agreement",
        description="Defines uptime commitments and remedies for cloud service providers.",
        fields=[
            FieldConfig("customer", "Customer", "Legal name of the customer"),
            FieldConfig("provider", "Provider", "Legal name of the service provider"),
            FieldConfig("targetUptime", "Target Uptime", "Uptime commitment percentage (e.g. 99.9%)"),
            FieldConfig("targetResponseTime", "Target Response Time", "Response time commitment for support requests (e.g. 4 business hours)"),
            FieldConfig("supportChannel", "Support Channel", "How to submit support requests (e.g. email address, ticketing URL)"),
            FieldConfig("uptimeCredit", "Uptime Credit", "Service credit formula if uptime SLO is missed"),
            FieldConfig("responseTimeCredit", "Response Time Credit", "Service credit formula if response time SLO is missed"),
            FieldConfig("scheduledDowntime", "Scheduled Downtime", "Planned maintenance windows excluded from SLO calculations"),
            FieldConfig("subscriptionPeriod", "Subscription Period", "The subscription period this SLA applies to"),
        ],
    ),

    "Professional Services Agreement": DocumentConfig(
        name="Professional Services Agreement",
        description="Governs the delivery of professional and consulting services.",
        fields=[
            FieldConfig("customer", "Customer", "Legal name of the customer"),
            FieldConfig("provider", "Provider", "Legal name of the service provider"),
            FieldConfig("effectiveDate", "Effective Date", "Agreement start date (YYYY-MM-DD)"),
            FieldConfig("governingLaw", "Governing Law", "US state whose laws govern the agreement"),
            FieldConfig("chosenCourts", "Chosen Courts", "Courts for dispute resolution"),
            FieldConfig("generalCapAmount", "General Cap Amount", "General liability cap amount"),
            FieldConfig("increasedClaims", "Increased Claims", "Claim types subject to a higher cap"),
            FieldConfig("increasedCapAmount", "Increased Cap Amount", "Liability cap for increased-cap claims"),
            FieldConfig("unlimitedClaims", "Unlimited Claims", "Claim types with no liability cap"),
            FieldConfig("deliverables", "Deliverables", "Description of deliverables to be produced"),
            FieldConfig("fees", "Fees", "Amount and fee structure for the services"),
            FieldConfig("paymentPeriod", "Payment Period", "When payment is due (e.g. 30 days after invoice)"),
            FieldConfig("rejectionPeriod", "Rejection Period", "How long the customer has to reject deliverables"),
            FieldConfig("sowTerm", "SOW Term", "Statement of Work duration"),
            FieldConfig("customerObligations", "Customer Obligations", "What the customer must provide or do"),
        ],
    ),

    "Data Processing Agreement": DocumentConfig(
        name="Data Processing Agreement",
        description="For GDPR and privacy-compliant handling of personal data by service providers.",
        fields=[
            FieldConfig("customer", "Customer (Controller)", "Legal name of the data controller"),
            FieldConfig("provider", "Provider (Processor)", "Legal name of the data processor"),
            FieldConfig("categoriesOfPersonalData", "Categories of Personal Data", "Types of personal data being processed (e.g. name, email, IP address)"),
            FieldConfig("categoriesOfDataSubjects", "Categories of Data Subjects", "Whose personal data is processed (e.g. end users, employees)"),
            FieldConfig("specialCategoryData", "Special Category Data", "Any sensitive data such as health, biometric, or racial data, or 'None'"),
            FieldConfig("natureAndPurposeOfProcessing", "Nature and Purpose of Processing", "Why and how the data is processed"),
            FieldConfig("durationOfProcessing", "Duration of Processing", "How long data will be processed"),
            FieldConfig("governingMemberState", "Governing Member State", "EU member state whose law governs Standard Contractual Clauses"),
            FieldConfig("approvedSubprocessors", "Approved Subprocessors", "List of permitted sub-processors (names and locations)"),
            FieldConfig("securityPolicy", "Security Policy", "Reference to provider's security policy document or URL"),
        ],
    ),

    "Software License Agreement": DocumentConfig(
        name="Software License Agreement",
        description="Governs the licensing of software products to end users or businesses.",
        fields=[
            FieldConfig("customer", "Customer", "Legal name of the customer"),
            FieldConfig("provider", "Provider", "Legal name of the software provider"),
            FieldConfig("effectiveDate", "Effective Date", "Agreement start date (YYYY-MM-DD)"),
            FieldConfig("governingLaw", "Governing Law", "US state whose laws govern the agreement"),
            FieldConfig("chosenCourts", "Chosen Courts", "Courts for dispute resolution"),
            FieldConfig("permittedUses", "Permitted Uses", "What the customer is allowed to do with the software"),
            FieldConfig("licenseLimits", "License Limits", "Scope or numeric limits on the license (e.g. number of users, devices)"),
            FieldConfig("paymentProcess", "Payment Process", "How and when payments are made"),
            FieldConfig("subscriptionPeriod", "Subscription Period", "License subscription period"),
            FieldConfig("warrantyPeriod", "Warranty Period", "Duration of the software warranty (e.g. 90 days)"),
            FieldConfig("generalCapAmount", "General Cap Amount", "General liability cap amount"),
            FieldConfig("increasedClaims", "Increased Claims", "Claim types subject to a higher cap"),
            FieldConfig("increasedCapAmount", "Increased Cap Amount", "Liability cap for increased-cap claims"),
            FieldConfig("unlimitedClaims", "Unlimited Claims", "Claim types with no liability cap"),
        ],
    ),

    "Partnership Agreement": DocumentConfig(
        name="Partnership Agreement",
        description="For formalising commercial partnerships, referral arrangements, and joint go-to-market relationships.",
        fields=[
            FieldConfig("company", "Company", "Legal name of the company"),
            FieldConfig("partner", "Partner", "Legal name of the partner company"),
            FieldConfig("effectiveDate", "Effective Date", "Agreement start date (YYYY-MM-DD)"),
            FieldConfig("endDate", "End Date", "Agreement end date (YYYY-MM-DD)"),
            FieldConfig("obligations", "Obligations", "Description of each party's duties and responsibilities under the partnership"),
            FieldConfig("paymentProcess", "Payment Process", "How and when payments flow between parties, or 'None' if no fees"),
            FieldConfig("territory", "Territory", "Geographic territory for the partnership and any trademark license"),
            FieldConfig("governingLaw", "Governing Law", "US state whose laws govern the agreement"),
            FieldConfig("chosenCourts", "Chosen Courts", "Courts for dispute resolution"),
            FieldConfig("generalCapAmount", "General Cap Amount", "General liability cap amount"),
            FieldConfig("increasedClaims", "Increased Claims", "Claim types subject to a higher cap"),
            FieldConfig("increasedCapAmount", "Increased Cap Amount", "Liability cap for increased-cap claims"),
            FieldConfig("unlimitedClaims", "Unlimited Claims", "Claim types with no liability cap"),
        ],
    ),

    "Pilot Agreement": DocumentConfig(
        name="Pilot Agreement",
        description="For time-limited product evaluations before a full commercial subscription.",
        fields=[
            FieldConfig("provider", "Provider", "Legal name of the service provider"),
            FieldConfig("customer", "Customer", "Legal name of the customer"),
            FieldConfig("effectiveDate", "Effective Date", "Pilot start date (YYYY-MM-DD)"),
            FieldConfig("pilotPeriod", "Pilot Period", "Duration of the pilot evaluation (e.g. 90 days)"),
            FieldConfig("generalCapAmount", "General Cap Amount", "Liability cap amount"),
            FieldConfig("governingLaw", "Governing Law", "US state whose laws govern the agreement"),
            FieldConfig("chosenCourts", "Chosen Courts", "Courts for dispute resolution"),
            FieldConfig("noticeAddress", "Notice Address", "Contact address for formal notices"),
        ],
    ),

    "Business Associate Agreement": DocumentConfig(
        name="Business Associate Agreement",
        description="For HIPAA-compliant handling of protected health information by service providers.",
        fields=[
            FieldConfig("provider", "Business Associate (Provider)", "Legal name of the Business Associate (service provider handling PHI)"),
            FieldConfig("company", "Covered Entity (Customer)", "Legal name of the Covered Entity (the healthcare organization)"),
            FieldConfig("baaEffectiveDate", "BAA Effective Date", "Date this BAA takes effect (YYYY-MM-DD)"),
            FieldConfig("agreement", "Underlying Agreement", "Reference to the underlying service agreement this BAA supplements"),
            FieldConfig("breachNotificationPeriod", "Breach Notification Period", "Time period within which provider must notify of a breach (e.g. 60 days)"),
            FieldConfig("limitations", "PHI Limitations", "Any specific restrictions on PHI handling (offshoring, de-identification, aggregation), or 'None'"),
        ],
    ),

    "AI Addendum": DocumentConfig(
        name="AI Addendum",
        description="Governs the use of AI features within a cloud service, including data usage and model training restrictions.",
        fields=[
            FieldConfig("customer", "Customer", "Legal name of the customer"),
            FieldConfig("provider", "Provider", "Legal name of the service provider"),
            FieldConfig("trainingData", "Training Data", "What customer data (if any) may be used for AI model training, or 'None'"),
            FieldConfig("trainingPurposes", "Training Purposes", "Permitted purposes for any training use"),
            FieldConfig("trainingRestrictions", "Training Restrictions", "Restrictions on how AI training may be conducted"),
            FieldConfig("improvementRestrictions", "Improvement Restrictions", "Limits on using customer data for non-training product improvement"),
        ],
    ),
}

# Also map Mutual NDA Cover Page to the same config as Mutual NDA
DOCUMENT_CONFIGS["Mutual NDA Cover Page"] = DOCUMENT_CONFIGS["Mutual NDA"]

SUPPORTED_DOCUMENT_NAMES = list(DOCUMENT_CONFIGS.keys())


def get_config(document_type: str) -> DocumentConfig | None:
    return DOCUMENT_CONFIGS.get(document_type)
