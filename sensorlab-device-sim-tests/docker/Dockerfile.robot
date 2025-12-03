FROM python:3.12-slim
WORKDIR /tests
COPY python-tests/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY python-tests ./python-tests
CMD ["robot", "-d", ".reports", "python-tests/tests.robot"]