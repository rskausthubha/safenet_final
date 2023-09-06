import json
import sys
import ember
import pickle
import os
import warnings

file_name = json.loads(sys.argv[1])

warnings.filterwarnings("ignore")

input_pe_file = open(file_name, "rb").read()

extracted_features = ember.PEFeatureExtractor()
vectorized_data = extracted_features.feature_vector(input_pe_file)

vectorized_data = vectorized_data.reshape(1, -1)

cwd = os.path.cwd()

model = pickle.load(open(os.path.join(cwd, "DT_bodmas_model"), "rb"))
category_prediction = model.predict(vectorized_data)

labeler = pickle.load(open(os.path.join(cwd, "DT_bodmas_labeler"), "rb"))
ans = labeler.inverse_transform([category_prediction])

print(ans[0])