from flask import Flask, request
import os
import pandas as pd
from sklearn.metrics import accuracy_score, f1_score, mean_squared_error
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/fe-se-round-2', methods=['POST'])
def eval1():
    if request.method == 'POST':

        private_acc = 0
        public_acc = 0

        try:

            file_url = request.json['file_url']
            attempt = pd.read_csv(file_url)
            soln = pd.read_csv('static/fe-se-2.csv')

            if not attempt.isnull().sum().sum():

                    print(soln.shape)
                    
                    attempt = attempt.loc[:, "explosion"].values
                    soln = soln.loc[:, "explosion"].values
                    
                    public_soln = soln[:8000]
                    public_att = attempt[:8000]

                    private_soln = soln[8000:]
                    private_att = attempt[8000:]

                    public_acc = mean_squared_error(public_soln, public_att)
                    private_acc = mean_squared_error(private_soln, private_att)

            return {'private': private_acc,
        'public': public_acc}

        except:
            return {'private': private_acc,
        'public': public_acc}



@app.route('/te-be-round-2', methods=['POST'])
def eval2():
    if request.method == 'POST':

        private_acc = 10
        public_acc = 10

        try:

            file_url = request.json['file_url']
            attempt = pd.read_csv(file_url)
            soln = pd.read_csv('static/te-be-2.csv')
            labels = {j:i for i,j in enumerate(soln.Topic.unique().tolist())}
            soln.Topic = soln.Topic.map(labels)
            attempt.Topic = attempt.Topic.map(labels)
            if not attempt.isnull().sum().sum():
                    
                    print(soln.shape)
                    
                    attempt = attempt.loc[:, "Topic"].values
                    soln = soln.loc[:, "Topic"].values
                    
                    public_soln = soln[:1400]
                    public_att = attempt[:1400]

                    private_soln = soln[1400:]
                    private_att = attempt[1400:]

                    public_acc = f1_score(public_soln, public_att, average='macro')
                    private_acc = f1_score(private_soln, private_att, average='macro')

            return {'private': private_acc,
        'public': public_acc}

        except:
            return {'private': private_acc,
        'public': public_acc}

# if __name__ == "__main__":
#     port = int(os.environ.get('PORT', 5000))
#     app.run(debug=True, host='0.0.0.0', port=port)
