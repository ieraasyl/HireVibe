"""
Script to check and update application resume_parsed data
"""
import asyncio
import json
from pathlib import Path
from app.db.session import async_session
from app.models.application import Application
from app.services_pdf.pdf_parser import PDFParserService
from sqlmodel import select
import aiofiles

async def check_and_update_applications():
    """Check applications and populate resume_parsed if missing"""
    async with async_session() as session:
        result = await session.execute(select(Application))
        applications = result.scalars().all()

        print(f"\n{'='*80}")
        print(f"TOTAL APPLICATIONS: {len(applications)}")
        print(f"{'='*80}\n")

        for i, application in enumerate(applications, 1):
            print(f"[{i}] {application.first_name} {application.last_name}")
            print(f"    ID: {application.id}")
            print(f"    Resume PDF: {application.resume_pdf}")
            print(f"    Has resume_parsed: {bool(application.resume_parsed)}")

            if application.resume_parsed:
                if isinstance(application.resume_parsed, dict) and "raw_text" in application.resume_parsed:
                    text_length = len(application.resume_parsed["raw_text"])
                    print(f"    Resume text length: {text_length} chars")
                else:
                    print(f"    Resume parsed type: {type(application.resume_parsed)}")
            else:
                # Try to parse the resume if PDF exists
                if application.resume_pdf:
                    file_path = Path(application.resume_pdf)
                    if not file_path.exists():
                        # Try relative to current directory
                        alt_path = Path.cwd() / application.resume_pdf
                        if alt_path.exists():
                            file_path = alt_path

                    if file_path.exists():
                        print(f"    📄 Parsing resume PDF: {file_path}")
                        try:
                            async with aiofiles.open(file_path, 'rb') as f:
                                pdf_bytes = await f.read()

                            parser = PDFParserService()
                            extracted_text, metadata = parser.extract_text_from_pdf(pdf_bytes)

                            if extracted_text:
                                application.resume_parsed = {
                                    "raw_text": extracted_text,
                                    "metadata": metadata
                                }
                                session.add(application)
                                await session.commit()
                                print(f"    ✅ Resume parsed and saved: {len(extracted_text)} chars")
                            else:
                                print(f"    ❌ No text extracted from PDF")
                        except Exception as e:
                            print(f"    ❌ Error parsing PDF: {e}")
                    else:
                        print(f"    ❌ PDF file not found: {application.resume_pdf}")
                else:
                    print(f"    ❌ No resume PDF path")

            print(f"{'-'*80}\n")

if __name__ == "__main__":
    asyncio.run(check_and_update_applications())