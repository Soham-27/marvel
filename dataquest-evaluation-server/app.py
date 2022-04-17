from flask import Flask, request
import os
import pandas as pd
from sklearn.metrics import accuracy_score, multilabel_confusion_matrix, mean_squared_error
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/fe-se-round-1', methods=['POST'])
def eval1():
    if request.method == 'POST':
        print("nkjka")
        file_url = request.json['file_url']
        attempt = pd.read_csv(file_url)
        soln = pd.read_csv('static/fe-se-1.csv')

        print(attempt.head)

        private_acc = 0
        public_acc = 0

        if attempt.shape == soln.shape:
            print("Fine til; here")
            attempt = attempt.iloc[:, 1].values
            soln = soln.iloc[:, 1].values
            
            public_soln = soln[:1000]
            public_att = attempt[:1000]

            private_soln = soln[1000:]
            private_att = attempt[1000:]

            public_acc = accuracy_score(public_soln, public_att)
            private_acc = accuracy_score(private_soln, private_att)

    return {'private': private_acc,
    'public': public_acc}

def rmse_tp(reg_soln, reg_att, cl_soln, cl_att):                                 ## rmse true positives
    score = 0
    mat = multilabel_confusion_matrix(cl_soln, cl_att, labels=["Tee", "Cap", "Mug"])
    mse = mean_squared_error(reg_soln, reg_att)
    cl_score = mat[0][1][1]/(mat[0][1][1] + mat[0][0][1])
    return mse + (1 - cl_score)*65


@app.route('/te-be-round-1', methods=['POST'])
def eval2():
    if request.method == 'POST':

        file_url = request.json['file_url']
        attempt = pd.read_csv(file_url)
        soln = pd.read_csv('static/te-be-1.csv')

        private_acc = 200
        public_acc = 200

        if attempt.shape == soln.shape:
            
            attempt_cl = attempt.iloc[:, 2].values
            soln_cl = soln.iloc[:, 2].values

            attempt_reg = attempt.iloc[:, 1].values
            soln_reg = soln.iloc[:, 1].values

            pr_mark = int(soln.shape[0]*0.7)

            print(pr_mark)
            
            public_soln_cl = soln_cl[:pr_mark]
            public_att_cl = attempt_cl[:pr_mark]

            public_soln_reg = soln_reg[:pr_mark]
            public_att_reg = attempt_reg[:pr_mark]


            private_soln_cl = soln_cl[pr_mark:]
            private_att_cl = attempt_cl[pr_mark:]

            private_soln_reg = soln_reg[pr_mark:]
            private_att_reg = attempt_reg[pr_mark:]

            public_acc = rmse_tp(public_soln_reg, public_att_reg, public_soln_cl, public_att_cl)
            private_acc = rmse_tp(private_soln_reg, private_att_reg, private_soln_cl, private_att_cl)

    return {'private': private_acc,
    'public': public_acc}


# if __name__ == "__main__":
#     port = int(os.environ.get('PORT', 5000))
#     app.run(debug=True, host='0.0.0.0', port=port)