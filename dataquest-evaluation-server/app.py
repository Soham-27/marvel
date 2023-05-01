from flask import Flask, request
import os
import pandas as pd
from sklearn.metrics import accuracy_score, f1_score, mean_squared_error
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/dataquest-round-1', methods=['POST'])
def eval1():
    if request.method == 'POST':

        private_acc = 0
        public_acc = 0

        try:

            file_url = request.json['file_url']
            attempt = pd.read_csv(file_url)
            soln = pd.read_csv('Static/test_data_r1_server.csv')

            attempt = attempt[['customerID','Repeat Purchase']]

            attempt['Repeat Purchase'] = attempt['Repeat Purchase'].apply(lambda x: x.lower())
            soln['Repeat Purchase'] = soln['Repeat Purchase'].apply(lambda x: x.lower())

            if attempt.shape == soln.shape:
                print("Fine till here")
                attempt = attempt.iloc[:, 1].values
                soln = soln.iloc[:, 1].values
                
                public_soln = soln[:1500]
                public_att = attempt[:1500]

                private_soln = soln[1500:]
                private_att = attempt[1500:]

                public_acc = accuracy_score(public_soln, public_att)
                private_acc = accuracy_score(private_soln, private_att)

            return {'private': private_acc,
            'public': public_acc}
    
        except:

            return{
                'private': 0,
                'public': 0
            }
        
def rmse_tp(reg_soln, reg_att):                                 ## rmse true positives
    mse = mean_squared_error(reg_soln, reg_att)
    print(mse)
    return mse



@app.route('/te-be-round-2', methods=['POST'])
def eval2():

        if request.method == 'POST':

            file_url = request.json['file_url']
            attempt = pd.read_csv(file_url)
            soln = pd.read_csv('Static/test_data_round2_server.csv')

            print(attempt.shape)
            print(soln.shape)

            private_acc = 2000000
            public_acc = 2000000

            try:

                if attempt.shape == soln.shape:

                    print("shape equal")

                    attempt_reg = attempt.iloc[:, -1].values
                    soln_reg = soln.iloc[:, -1].values

                    pr_mark = int(soln.shape[0]*0.7)

                    print(pr_mark)
                    
                    public_soln_reg = soln_reg[:pr_mark]
                    public_att_reg = attempt_reg[:pr_mark]

                    private_soln_reg = soln_reg[pr_mark:]
                    private_att_reg = attempt_reg[pr_mark:]

                    public_acc = rmse_tp(public_soln_reg, public_att_reg)

                    print(public_acc)

                    private_acc = rmse_tp(private_soln_reg, private_att_reg)

                    print(private_acc)

                return {'private': private_acc,
                'public': public_acc}
            
            except:
                return {
                    'private': 2000000,
                    'public': 2000000
                }

# if __name__ == "__main__":
#     port = int(os.environ.get('PORT', 5000))
#     app.run(debug=True, host='0.0.0.0', port=port)
