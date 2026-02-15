# ML-Based System Health Monitoring

## Phase 1: OS Monitoring & Rule-Based Analysis

### Features
- Real-time OS metric collection
- MySQL data storage
- Rule-based system health detection

### How to Run
1. Import `sql/schema.sql` into MySQL
2. Update DB credentials in `config.py`
3. Install dependencies:
   pip install -r backend/requirements.txt
4. Run:
   python backend/app.py