class JsonLoadException(Exception):
    pass
    @property
    def line_error(self):
        try:
                tabmess = self.message.split(':')
                return "{0} : {1}".format(
                    tabmess[-2].strip(),
                    tabmess[-1].strip()
                )
        except Exception:
            return "UNKNOW"
