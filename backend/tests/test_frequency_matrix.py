import unittest

from madgab.frequency_matrix import FrequencyMatrix


class testFrequencyMatrix(unittest.TestCase):
    def test_normalize(self):
        f = FrequencyMatrix()
        self.assertTrue(
            all([abs(x - 1) < 0.0001 for x in f.frequency_matrix.sum(axis=1)])
        )

    def test_indexing(self):
        f = FrequencyMatrix()
        with self.subTest("Valid index."):
            self.assertTrue(isinstance(f["a", "b"], float))
        with self.subTest("X bound out of range"):
            with self.assertRaises(KeyError):
                f["A", "a"]
        with self.subTest("Y bound out of range"):
            with self.assertRaises(KeyError):
                f["a", "A"]
