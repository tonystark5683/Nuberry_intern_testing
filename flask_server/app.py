from flask import Flask, jsonify
import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
def forecast_drill_down(sales_data, store_name='ALL', department='ALL', product_code='ALL', brand='ALL', forecast_period=30, holiday=None):
    # Filter data based on selected parameters
    data = sales_data.copy()
    group_levels=[]
    group_levels.append('BillDate')
    if store_name != 'ALL':
        data = data[data['StoreName'] == store_name]
        group_levels.append('StoreName')
    if department != 'ALL':
        data = data[data['Department'] == department]
        group_levels.append('Department')
    if product_code != 'ALL':
        data = data[data['ProductCode'] == product_code]
        group_levels.append('ProductCode')
    if brand != 'ALL':
        data = data[data['BrandName'] == brand]
        group_levels.append('BrandName')

    print(group_levels)

    # Group by 'date' and aggregate columns
    agg_dict = {
        'Amount': 'sum',  # Sum 'amount'
    }

    data = data.groupby(group_levels).agg(agg_dict).reset_index()

    # Prepare data for Prophet model
    data = data.rename(columns={'BillDate': 'ds', 'Amount': 'y'})


    strt='2023-09-30'
    end='2023-10-31'



    final_model = Prophet (
                        growth="linear",
                        holidays=holiday,
                        seasonality_mode="multiplicative",
                        changepoint_prior_scale=50,
                        seasonality_prior_scale=35,
                        holidays_prior_scale=20,
                        daily_seasonality=False,
                        weekly_seasonality=False,
                        yearly_seasonality=False,
                        ). add_seasonality(
                        name= 'monthly',
                        period=30.5,
                        fourier_order=15
                        # ).add_seasonality(
                        # name = "daily",
                        # period = 1,
                        # fourier_order=55
                        ).add_seasonality(
                        name="weekly",
                        period = 7,
                        fourier_order=55
                        # ).add_seasonality(
                        # name="yearly",
                        # period = 365.25,
                        # fourier_order=20
                        # ).add_seasonality(
                        # name = "quarterly",
                        # period = 365.25/4,
                        # fourier_order=5,
                        # prior_scale = 15
                        )






    final_model.add_country_holidays(country_name='IN')
    final_model.fit(data)

    future = final_model.make_future_dataframe(periods=forecast_period, freq='D')
    forecast = final_model.predict(future)

    # Extract actual and predicted values
    actual = data[['ds', 'y']]

    # Plot the actual and predicted values for the entire period
    plt.figure(figsize=(12, 6))
    plt.plot(actual['ds'], actual['y'], label='Actual', color='blue')
    plt.plot(forecast['ds'], forecast['yhat'], label='Predicted', color='red')
    plt.title(f"Sales Forecast for {store_name} (All Departments)")
    plt.legend()
    plt.show()

    # # Filter the last 30 days of October
    # last_30_days_actual = actual[(actual['ds'] >= '2023-10-01') & (actual['ds'] <= '2023-10-31')]

    # # Calculate in-sample forecast for the last 30 days
    # last_30_days_forecast = forecast[forecast['ds'].isin(last_30_days_actual['ds'])]

    # # Reset the index for both DataFrames
    # last_30_days_actual = last_30_days_actual.reset_index(drop="true")
    # last_30_days_forecast = last_30_days_forecast.reset_index(drop="true")

    # # Calculate error percentage
    # last_30_days_forecast['error_percentage'] = 100 * ((last_30_days_forecast['yhat'] - last_30_days_actual['y']) / last_30_days_actual['y'])
    # last_30_days_forecast['error_percentage'] = last_30_days_forecast['error_percentage'].round(2)

    # # Calculate MAPE
    # mape = (100 * abs(last_30_days_actual['y'] - last_30_days_forecast['yhat']) / last_30_days_actual['y']).mean()
    # print()
    # print('MAPE: ', mape)
    # print()

    # # Create a DataFrame with last 30 days actual, predicted, and error percentage
    # result_df = pd.DataFrame({
    #     'Date': last_30_days_actual['ds'].dt.date,
    #     'StoreName': store_name,
    #     'Actual Sales': last_30_days_actual['y'],
    #     'Predicted Sales': last_30_days_forecast['yhat'],
    #     'Error Percentage (%)': last_30_days_forecast['error_percentage']
    # })

    # # Plot the actual and predicted values for the last 30 days
    # plt.figure(figsize=(12, 6))
    # plt.plot(last_30_days_actual['ds'], last_30_days_actual['y'], label='Actual', color='blue')
    # plt.plot(last_30_days_forecast['ds'], last_30_days_forecast['yhat'], label='Predicted (Last 30 Days)', color='red')
    # plt.title(f"Sales Forecast for {store_name} (Last 30 Days)")
    # plt.legend()
    # plt.show()
    
    forecasted_values = forecast[forecast['ds']>'2023-10-31'][['ds','yhat_lower','yhat_upper','yhat']].reset_index(drop=True)
   
   

    # return forecasted_values

    return 0

    # return data


def get_data():
    
    #add string here
    
    jsonresult_testing = [{"ds":"2023-11-01","yhat_lower":17031.9178783185,"yhat_upper":45753.7556408326,"yhat":31180.157521899},{"ds":"2023-11-02","yhat_lower":10111.112425872,"yhat_upper":37923.9777573384,"yhat":23459.9468540033},{"ds":"2023-11-03","yhat_lower":42777.7737187994,"yhat_upper":74932.864715716,"yhat":57934.5452557458},{"ds":"2023-11-04","yhat_lower":41647.4050484855,"yhat_upper":77857.1496924955,"yhat":58366.3565483307},{"ds":"2023-11-05","yhat_lower":29081.6906601624,"yhat_upper":69272.0718091724,"yhat":48308.5982453372},{"ds":"2023-11-06","yhat_lower":17222.8721290357,"yhat_upper":58098.6043525463,"yhat":36687.5877208421},{"ds":"2023-11-07","yhat_lower":8115.9964873895,"yhat_upper":47107.5320500168,"yhat":26858.2351672868},{"ds":"2023-11-08","yhat_lower":3534.887802518,"yhat_upper":47014.6148412149,"yhat":24200.7206466062},{"ds":"2023-11-09","yhat_lower":521.9417006989,"yhat_upper":48793.2891728423,"yhat":25235.2338002277},{"ds":"2023-11-10","yhat_lower":3918.7643929774,"yhat_upper":106817.0278964165,"yhat":53169.8768379791},{"ds":"2023-11-11","yhat_lower":-7274.1586196285,"yhat_upper":136783.9314866865,"yhat":61873.4474099293},{"ds":"2023-11-12","yhat_lower":-13363.8679259091,"yhat_upper":145572.0672590284,"yhat":60040.2885985086},{"ds":"2023-11-13","yhat_lower":-8544.1364588272,"yhat_upper":57255.007714916,"yhat":21059.0854939823},{"ds":"2023-11-14","yhat_lower":-25977.7670597948,"yhat_upper":116060.5461424235,"yhat":42190.0074062085},{"ds":"2023-11-15","yhat_lower":-27293.4391665866,"yhat_upper":95062.8560734787,"yhat":32457.6756978368},{"ds":"2023-11-16","yhat_lower":-45209.3699789639,"yhat_upper":149789.0157415617,"yhat":48895.6488248177},{"ds":"2023-11-17","yhat_lower":-88522.4712070154,"yhat_upper":265764.6825560004,"yhat":78621.796422098},{"ds":"2023-11-18","yhat_lower":-98366.5616709596,"yhat_upper":261913.5550659014,"yhat":72284.8839239464},{"ds":"2023-11-19","yhat_lower":-149173.1169473018,"yhat_upper":362011.5739460089,"yhat":94150.2644595379},{"ds":"2023-11-20","yhat_lower":-87033.9634804458,"yhat_upper":188657.8595770027,"yhat":47333.7744996014},{"ds":"2023-11-21","yhat_lower":-126988.6242129976,"yhat_upper":265978.6226448562,"yhat":61034.3483247648},{"ds":"2023-11-22","yhat_lower":-132110.143208537,"yhat_upper":255396.2731445004,"yhat":56982.0126369349},{"ds":"2023-11-23","yhat_lower":-117707.2192875053,"yhat_upper":210109.2356663602,"yhat":43319.6796011554},{"ds":"2023-11-24","yhat_lower":-178327.5309925467,"yhat_upper":329064.6572120326,"yhat":65357.008077415},{"ds":"2023-11-25","yhat_lower":-200095.8096106572,"yhat_upper":365976.193002674,"yhat":68816.4418580385},{"ds":"2023-11-26","yhat_lower":-237987.5971119364,"yhat_upper":420264.5799521924,"yhat":75334.2070933854},{"ds":"2023-11-27","yhat_lower":-31361.9882962016,"yhat_upper":53132.5631932641,"yhat":8813.2897027865},{"ds":"2023-11-28","yhat_lower":-120009.7529679479,"yhat_upper":206282.1334742443,"yhat":33749.6792963023},{"ds":"2023-11-29","yhat_lower":-118788.5543601049,"yhat_upper":196272.0994678196,"yhat":31155.0396850922},{"ds":"2023-11-30","yhat_lower":-169020.595759894,"yhat_upper":268664.6755422726,"yhat":40785.3113510644}]
    
    return test_data


@app.route('/run_forecast', methods=['GET'])
def run_forecast():
    
    # # Parse input data from the request
    # data = request.get_json()
    # data = pd.read_csv(r"C:\Users\Procastinator\Desktop\NUBERRYcsv.csv", parse_dates=['BillDate'], dayfirst= True)
    # data = data[['StoreName','BillDate','Department','ProductCode','BrandName','Amount']]
    # # Call the forecast_drill_down function
    # result = forecast_drill_down(data,'Adyar')
    # # print(result)
    # result['ds'] = result['ds'].dt.strftime('%Y-%m-%d')
    # json_result = result.to_json(orient='records')
    # print(json_result)
    # Convert result to JSON and return it
    testing_string = [{
        "ds" : "hello, this is for test",
        "yhat_lower" : "hello, this is for test",
        "yhat_upper" : "hello, this is for test",
        "yhat" : "hello, this is for test"

    },{
        "ds" : "hello, this is for test",
        "yhat_lower" : "hello, this is for test",
        "yhat_upper" : "hello, this is for test",
        "yhat" : "hello, this is for test"
    },
    {
        "ds" : "hello, this is for test",
        "yhat_lower" : "hello, this is for test",
        "yhat_upper" : "hello, this is for test",
        "yhat" : "hello, this is for test"
    },{
        "ds" : "hello, this is for test",
        "yhat_lower" : "hello, this is for test",
        "yhat_upper" : "hello, this is for test",
        "yhat" : "hello, this is for test"
    }]
    
    test_data = get_data()
    
    return jsonify(test_data)

if __name__ == '__main__':
    app.run(debug="true")