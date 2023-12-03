import os
from openai import OpenAI

client = OpenAI(api_key='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')

# chat_completion = client.chat.completions.create(
#     messages=[
#         {
#             "role": "user",
#             "content": "Say this is a test",
#         }
#     ],
#     model="gpt-3.5-turbo",
# )

response = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[{"role": "user","content": "Say this is a test"}],
  temperature=0.7,
  max_tokens=64,
  top_p=1
)

# print(chat_completion.message)
print(response)
