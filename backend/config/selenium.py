import time

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.remote.webelement import WebElement

from django.contrib.staticfiles.testing import StaticLiveServerTestCase


class SeleniumTestCase(StaticLiveServerTestCase):
    @classmethod
    def setUp(cls):
        """ Sets up our test case before running any tests """
        super().setUpClass()
        desires = DesiredCapabilities.CHROME
        desires['loggingPrefs'] = {'browser': 'ALL', 'performance': 'ALL'}

        chrome_options = webdriver.ChromeOptions()
        # chrome_options.add_argument('--headless')

        for arg in [
            '--window-size=1920,1080'
            '--disable-extensions',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-impl-side-painting',
            '--disable-gpu-sandbox',
            '--disable-accelerated-2d-canvas',
            '--disable-accelerated-jpeg-decoding',
            '--no-sandbox',
            '--test-type=ui',
            '--autoplay-policy=no-user-gesture-required',
        ]:
            chrome_options.add_argument(arg)

        cls.driver = webdriver.Chrome(
            desired_capabilities=desires,
            chrome_options=chrome_options
        )

        cls.driver.implicitly_wait(5)

    @classmethod
    def tearDownClass(cls):
        if hasattr(cls, 'driver'):
            cls.driver.refresh()
            cls.driver.close()
            cls.driver.quit()
        super().tearDownClass()

    def check_log_for_errors(self):
        """ Check the console log for any errors. Fail if we find any. """
        log = self.driver.get_log('browser')
        error_messages = []

        for this_log in log:
            if this_log['level'] == 'SEVERE':
                error_messages.append(this_log['message'])

        if error_messages:
            all_msgs = "\n".join(error_messages)
            self.fail(f'Errors found on page: \n {all_msgs}')

    def scroll_to(self, dom_element):
        """
        Scroll to a particular dom_element until it is in view.
        """
        self.driver.execute_script('arguments[0].scrollIntoView(true);', dom_element)

    def get(self, url):
        if 'http' not in url:
            url = self.live_server_url + url
        self.driver.get(url)

    @staticmethod
    def _get_by_from_selector(selector):
        """
        Modified from seleniumbase (MIT license) -- find the proper 'by' type
        from a selector.
        """
        if (selector.startswith('/')
                or selector.startswith('./')
                or selector.startswith('(')):
            return By.XPATH
        else:
            return By.CSS_SELECTOR

    @property
    def wait(self):
        return WebDriverWait(self.driver, 15)  # wait 15 seconds

    def wait_until_something(self, something_tuple, fail_msg='Failed') -> WebElement:
        try:
            found_element = self.wait.until(
                EC.presence_of_element_located(something_tuple)
            )
        except TimeoutException:
            self.fail(fail_msg)
        return found_element

    def el(self, selector):
        """
        Very important method: get a single element either from a CSS selector
        (tag name, class, id) or an XPath -- wait for it to appear (in case you've
        just done something to trigger it -- and scroll so it is visible on the page
        so you can click on it.
        """
        by = self._get_by_from_selector(selector)
        element = self.wait_until_something(
            (by, selector),
            f'element matching {selector} never appeared!'
        )
        self.scroll_to(element)
        return element

    def headed_sleep(self, duration: int = 1):
        """
        Sleep if running in headed mode. Makes it easier to see what's going on.
        """
        # if getattr(self, 'headed', False):
        time.sleep(duration)
