from groq import Groq
from app.config import settings
from decimal import Decimal
import json


class GradingService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        
    async def grade_comprehension(self, challenge, explanation: str):
        """
        Use Groq to grade code comprehension challenges
        """
        prompt = f"""You are grading a coding challenge submission.

Challenge: {challenge.title}
Description: {challenge.description}

Code to explain:
```{challenge.language or 'python'}
{challenge.code_snippet}
```

Student's explanation:
{explanation}

Grade the explanation on a scale of 0-100 based on:
- Accuracy (0-40 points): Is the explanation technically correct?
- Completeness (0-30 points): Did they cover all important aspects?
- Clarity (0-20 points): Is it well-written and easy to understand?
- Depth (0-10 points): Did they show deep understanding?

Respond ONLY with valid JSON in this exact format:
{{
  "score": 85,
  "feedback": "Your detailed feedback here. Explain what they got right and what could be improved.",
  "breakdown": {{
    "accuracy": 38,
    "completeness": 25,
    "clarity": 15,
    "depth": 7
  }}
}}
"""
        
        try:
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=1000
            )
            
            result_text = response.choices[0].message.content
            
            # Try to extract JSON from the response
            import re
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                result_text = json_match.group(0)
            
            result = json.loads(result_text)
            
            return {
                "score": Decimal(str(result["score"])),
                "max_score": Decimal("100"),
                "is_correct": result["score"] >= 70,
                "feedback": result["feedback"],
                "grading_details": result.get("breakdown", {})
            }
            
        except Exception as e:
            print(f"Grading error: {e}")
            print(f"Response was: {result_text if 'result_text' in locals() else 'N/A'}")
            # Fallback scoring
            return {
                "score": Decimal("50"),
                "max_score": Decimal("100"),
                "is_correct": False,
                "feedback": "Submission received. Automated grading temporarily unavailable.",
                "grading_details": {}
            }
    
    async def grade_debugging(self, test_results):
        """
        Grade debugging challenges based on test pass rate
        """
        total_tests = len(test_results)
        passed_tests = sum(1 for t in test_results if t.get("passed", False))
        
        score = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        feedback = f"Passed {passed_tests} out of {total_tests} test cases."
        if passed_tests == total_tests:
            feedback += " Perfect! All tests passed."
        elif passed_tests > total_tests * 0.7:
            feedback += " Good work, but some edge cases failed."
        else:
            feedback += " Review the failed test cases and try again."
        
        return {
            "score": Decimal(str(score)),
            "max_score": Decimal("100"),
            "is_correct": passed_tests == total_tests,
            "feedback": feedback,
            "grading_details": {"passed": passed_tests, "total": total_tests}
        }
    
    async def grade_ai_review(self, challenge, review: str):
        """
        Grade AI code review challenges
        """
        prompt = f"""You are grading a code review submission.

Challenge: {challenge.title}
Code being reviewed:
```{challenge.language or 'python'}
{challenge.code_snippet}
```

Student's code review:
{review}

The code has intentional issues (bugs, security vulnerabilities, performance problems).
Grade how well the student identified these issues (0-100):
- Issue Identification (0-40 points): Did they find the critical problems?
- Impact Assessment (0-25 points): Do they understand the severity?
- Solution Quality (0-25 points): Are their fixes appropriate?
- Best Practices (0-10 points): Do they demonstrate good security/coding knowledge?

Respond ONLY with valid JSON in this exact format:
{{
  "score": 85,
  "feedback": "Detailed feedback about their review here",
  "breakdown": {{
    "issue_identification": 38,
    "impact_assessment": 22,
    "solution_quality": 20,
    "best_practices": 5
  }}
}}
"""
        
        try:
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=1000
            )
            
            result_text = response.choices[0].message.content
            
            # Try to extract JSON from the response
            # Sometimes the model adds markdown code fences
            import re
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                result_text = json_match.group(0)
            
            result = json.loads(result_text)
            
            return {
                "score": Decimal(str(result["score"])),
                "max_score": Decimal("100"),
                "is_correct": result["score"] >= 70,
                "feedback": result["feedback"],
                "grading_details": result.get("breakdown", {})
            }
            
        except Exception as e:
            print(f"Grading error: {e}")
            return {
                "score": Decimal("50"),
                "max_score": Decimal("100"),
                "is_correct": False,
                "feedback": "Submission received. Review in progress.",
                "grading_details": {}
            }

# Global instance
grading_service = GradingService()