from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from imdown_backend.config import Config


jobstores = {
'default': SQLAlchemyJobStore(url=Config.SQLALCHEMY_DATABASE_URI)
}
scheduler = BackgroundScheduler(jobstores=jobstores)
scheduler.start()

    
