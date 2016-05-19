class JsonLoadException(Exception):
    pass
    @property
    def line_error(self):
        try:
            return self.message.split('delimiter: ')[1]
        except Exception:
            return "UNKNOW"
            