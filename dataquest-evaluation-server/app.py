from flask import Flask, request
import os
import pandas as pd
from sklearn.metrics import accuracy_score, f1_score, mean_squared_error
import numpy as np
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
            seniority = request.json['seniority']
            attempt = pd.read_csv(file_url)
            soln = pd.read_csv('Static/test_data_r1_server.csv')

            print(attempt.head)

            private_acc = 0
            public_acc = 0

            if attempt.shape == soln.shape:
                print("Fine till here")
                attempt = attempt.iloc[:, 1].values
                soln = soln.iloc[:, 1].values
            
                public_soln = soln[:1000]
                public_att = attempt[:1000]

                private_soln = soln[1000:]
                private_att = attempt[1000:]
                if(seniority == "FE" or seniority == "SE"):
                    public_acc = accuracy_score(public_soln, public_att)
                    private_acc = accuracy_score(private_soln, private_att)
                else:
                    public_acc = f1_score(public_soln, public_att)
                    private_acc = f1_score(private_soln, private_att)
                

            return {'private': private_acc,'public': public_acc}
    
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
        private_acc = 0
        public_acc = 0
        exec = 0
        try:
            file_url = request.json['file_url']
            exec = 1
            attempt = pd.read_csv(file_url)
            exec = 2
            soln = pd.read_csv('Static/r2_anskey.csv')
            exec = 3

            
            exec = attempt.shape
            if attempt.shape == soln.shape:
                
                print("Fine till here")
                attempt = attempt.iloc[:, 1].values
                soln = soln.iloc[:, 1].values
                
                public_soln = soln[:1000]
                public_att = attempt[:1000]
                
                private_soln = soln[1000:]
                private_att = attempt[1000:]
                
                public_mse = mean_squared_error(public_soln, public_att)
                private_mse = mean_squared_error(private_soln, private_att)
                public_mse = np.sqrt(public_mse)
                private_mse = np.sqrt(private_mse)
               

            return {'private': private_mse,'public': public_mse,'except':exec}
    
        except:

            return{
                'private': 500000,
                'public': 500000,
                'except' : exec
            }

      
# if _name_ == "_main_":
#     port = int(os.environ.get('PORT', 5000))
#     app.run(debug=True, host='0.0.0.0', port=port)


#   if request.method == 'POST':

#             try:

#                 file_url = request.json['file_url']
#                 attempt = pd.read_csv(file_url)
#                 soln = pd.read_csv('Static/test_data_round2_server.csv')

#                 print(attempt.shape)
#                 print(soln.shape)

#                 private_acc = 0
#                 public_acc = 0

#                 if attempt.shape == soln.shape:

#                     print("shape equal")

#                     attempt_reg = attempt.iloc[:, -1].values
#                     soln_reg = soln.iloc[:, -1].values

#                     pr_mark = int(soln.shape[0]*0.7)

#                     print(pr_mark)
                    
#                     public_soln_reg = soln_reg[:pr_mark]
#                     public_att_reg = attempt_reg[:pr_mark]

#                     private_soln_reg = soln_reg[pr_mark:]
#                     private_att_reg = attempt_reg[pr_mark:]

#                     public_acc = rmse_tp(public_soln_reg, public_att_reg)

#                     print(public_acc)

#                     private_acc = rmse_tp(private_soln_reg, private_att_reg)

#                     print(private_acc)

#                 return {'private': private_acc,
#                 'public': public_acc}
            
#             except:
#                 return {
#                     'private': 200000000,
#                     'public': 200000000
#                 }