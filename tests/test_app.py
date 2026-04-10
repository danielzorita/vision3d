import unittest
from app import app

class FlaskTest(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_index_status_code(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

    def test_index_content(self):
        response = self.app.get('/')
        self.assertIn(b'VISION 3D', response.data)
        self.assertIn(b'Synthesize Model', response.data, msg="Checking for the primary action button")
        self.assertIn(b'Developed by Daniel Zorita', response.data, msg="Checking for author credit")

if __name__ == '__main__':
    unittest.main()
