import json
import boto3
import openai
import csv
import os
import re
from io import StringIO

# Initialize the S3 client
s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        # Extract bucket and object details from the event
        bucket_name = event['Records'][0]['s3']['bucket']['name']
        object_key = event['Records'][0]['s3']['object']['key']

        # Extract folder name and file name from the object key
        folder_name, file_name = os.path.split(object_key)

        # Extract the case number from the file name
        match = re.search(r"Case_study_(\d+)", file_name)
        case_number = match.group(1) if match else "Unknown"

        # Download the questions file from S3
        question_file_path = '/tmp/all_questions.csv'
        s3.download_file(bucket_name, 'questions/all_questions.csv', question_file_path)

        # Read questions from the CSV file
        questions = []
        with open(question_file_path, 'r') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                questions.append(row['questions'])

        # Fetch OpenAI API key from environment variable
        openai.api_key = os.getenv('OpenAIKeyP')

        # Read the uploaded input file content
        file_obj = s3.get_object(Bucket=bucket_name, Key=object_key)
        file_content = file_obj['Body'].read().decode('utf-8')

        # Create a single prompt with all questions
        prompt = f"Here is some content:\n{file_content}\nBased on this content, please answer the following questions in detail:\n"
        for i, question in enumerate(questions, 1):
            prompt += f"Question {i}: {question}\n"

        # Use OpenAI API to generate answers for all questions
        openai_response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert at answering medical questionnaire."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            n=1,
            stop=None,
            temperature=0.7
        )

        # Extract and parse answers
        answers_text = openai_response.choices[0].message.content.strip()
        print(f"OpenAI Response:\n{answers_text}")

        # Parse the answers using markers like "Question 1:", "Question 2:", etc.
        answers = []
        for i in range(len(questions)):
            current_marker = f"Question {i+1}:"
            next_marker = f"Question {i+2}:" if i + 2 <= len(questions) else None

            start_index = answers_text.find(current_marker)
            end_index = answers_text.find(next_marker) if next_marker else len(answers_text)

            if start_index != -1:
                answer = answers_text[start_index + len(current_marker):end_index].strip()
                answers.append({"Question": questions[i], "Answer": answer})
            else:
                answers.append({"Question": questions[i], "Answer": "No answer provided"})

        # Save results to a CSV file
        csv_file_path = '/tmp/Case_study_output.csv'
        with open(csv_file_path, 'w', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=["Question", "Answer"])
            writer.writeheader()
            writer.writerows(answers)

        # Upload the CSV file to S3
        csv_file_key = f"allinOneGo/Case_study_{case_number}_answers.csv"
        with open(csv_file_path, 'rb') as csvfile:
            s3.put_object(Body=csvfile.read(), Bucket=bucket_name, Key=csv_file_key)

        # Log success and return a response
        print(f"Answers saved successfully to {csv_file_key}")
        return {
            'statusCode': 200,
            'body': json.dumps(f"File processed and answers saved successfully to {csv_file_key}")
        }

    except Exception as e:
        # Log and return errors
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error: {str(e)}")
        }
