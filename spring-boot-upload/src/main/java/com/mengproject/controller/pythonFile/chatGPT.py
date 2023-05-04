import openai
import os

current_directory = os.getcwd()
key_path = current_directory + \
    '/spring-boot-upload/src/main/java/com/mengproject/controller/pythonFile/'


openai.api_key = open(key_path + "GPT_key.txt", "r").read().strip('\n')

message_histoty = []

isAssistant = True

chat_path = current_directory + \
    '/spring-boot-upload/src/main/resources/'

# Reading first line from txt.
with open( chat_path + 'chat.txt', 'r') as file:
    line = file.readline()
    while line:
        if isAssistant:
            message_histoty.append(
                {"role": "assistant", "content": line.strip()})
            isAssistant = False
        else:
            message_histoty.append({"role": "user", "content": line.strip()})
            isAssistant = True
        line = file.readline()  # read the next line

# print(message_histoty)  # print the list of lines

completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    # model="gpt-4",
    messages=message_histoty,
)

reply_content = completion.choices[0].message.content
print(reply_content)
