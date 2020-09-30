from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from config import Config




class Scheduler:

    def __init__(self):
        jobstores = {
        'default': SQLAlchemyJobStore(url=Config.SQLALCHEMY_DATABASE_URI)
        }
        self.scheduler = BackgroundScheduler(jobstores=jobstores)
        self.scheduler.start()

    
