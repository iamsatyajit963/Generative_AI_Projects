from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime
from typing import List, Optional

class ModelName(str, Enum):
    GPT4_O = "gpt-4o"
    GPT4_O_MINI = "gpt-4o-mini"
    Llamma = "llama3.2"
    Phi = "phi3"
    Mistral = "mistral"
    Gemma_2B = "gemma2:2b"

class QueryInput(BaseModel):
    question: str
    session_id: str = Field(default=None)
    model: ModelName = Field(default=ModelName.GPT4_O_MINI)

class SourceInfo(BaseModel):
    source: str
    page_number: Optional[int]

class QueryResponse(BaseModel):
    answer: str
    session_id: str
    model: ModelName
    sources: List[SourceInfo]

class DocumentInfo(BaseModel):
    id: int
    filename: str
    upload_timestamp: datetime

class DeleteFileRequest(BaseModel):
    file_id: int


class ExtractFileRequest(BaseModel):
    file_name: str
    model: str

class DocInfo(BaseModel):
    sla_name: str = Field(..., example="AWS Managed Services Service Level Agreement")
    parties_involved: str = Field(..., example="AWS and AWS Managed Services customers")
    system_concerned: str = Field(..., example="AWS Managed Services (AMS)")
    description: str = Field(..., example="This SLA governs the use of AWS Managed Services, including AMS Advanced and AMS Accelerate. It outlines service commitments and credit eligibility for service level failures.")
    associated_metrics: List[str] = Field(..., example=["Incident Response Time", "Incident Restoration/Resolution Time","AWS Console/API Availability","Patch Management","Environment Recovery Initiation Time"])
    page_number: Optional[int] = Field(None, example= 200)

class ExtractInformation(BaseModel):
    docs_info: List[DocInfo] = Field(
        ...,
        example=[
            {
                "sla_name": "AWS Managed Services Service Level Agreement",
                "parties_involved": "AWS and AWS Managed Services customers",
                "system_concerned": "AWS Managed Services (AMS)",
                "description": "This SLA governs the use of AWS Managed Services, including AMS Advanced and AMS Accelerate. It outlines service commitments and credit eligibility for service level failures.",
                "associated_metrics": [
                    "Incident Response Time",
                    "Incident Restoration/Resolution Time",
                    "AWS Console/API Availability",
                    "Patch Management",
                    "Environment Recovery Initiation Time"
                ],
                "page_number": 200
            }
        ]
    )