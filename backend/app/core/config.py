from typing import List, Union, Any, Optional
from pydantic import AnyHttpUrl, PostgresDsn, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        case_sensitive=True, 
        env_file=".env",
        extra="ignore"
    )
    PROJECT_NAME: str = "Modern ERP System"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_CHANGE_ME"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # CORS
    BACKEND_CORS_ORIGINS: Any = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> Any:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip().rstrip("/") for i in v.split(",")]
        elif isinstance(v, list):
            return [str(i).rstrip("/") for i in v]
        return v

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "erp_db"
    POSTGRES_PORT: str = "5432"
    DATABASE_URI: Union[Any, None] = None

    @model_validator(mode="before")
    @classmethod
    def assemble_db_connection(cls, data: Any) -> Any:
        if isinstance(data, dict):
            # If DATABASE_URI is already provided (e.g. SQLite in .env), use it
            if data.get("DATABASE_URI"):
                return data
            
            # Otherwise assemble Postgres URI
            postgres_server = data.get("POSTGRES_SERVER")
            if postgres_server:
                data["DATABASE_URI"] = PostgresDsn.build(
                    scheme="postgresql+asyncpg",
                    username=data.get("POSTGRES_USER"),
                    password=data.get("POSTGRES_PASSWORD"),
                    host=data.get("POSTGRES_SERVER"),
                    port=int(data.get("POSTGRES_PORT") or 5432),
                    path=f"{data.get('POSTGRES_DB') or ''}",
                )
        return data

settings = Settings()
