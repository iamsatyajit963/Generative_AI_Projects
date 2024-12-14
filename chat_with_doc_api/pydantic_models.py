from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime
from typing import List, Optional

class ModelName(str, Enum):
    GPT4_O = "gpt-4o"
    GPT4_O_MINI = "gpt-4o-mini"

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

class PlayerInfo(BaseModel):
    player_name: str = Field(..., example="Sachin Tendulkar")
    date_of_birth: str = Field(..., example="April 24, 1973")
    test_total_run: Optional[str] = Field(None, example=15921)
    odi_total_run: Optional[str] = Field(None, example=18426)

class ExtractInformation(BaseModel):
    players: List[PlayerInfo] = Field(
        ...,
        example=[
            {
                "player_name": "Sachin Tendulkar",
                "date_of_birth": "April 24, 1973",
                "test_total_run": 15921,
                "odi_total_run": 18426
            },
            {
                "player_name": "Virat Kohli",
                "date_of_birth": "November 5, 1988",
                "test_total_run": 7490,
                "odi_total_run": 12040
            }
        ]
    )