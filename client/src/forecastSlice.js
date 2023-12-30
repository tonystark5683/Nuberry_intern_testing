// forecastSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  forecast: [],
  status: 'idle',
};

export const fetchForecastAsync = createAsyncThunk('forecast/fetchForecast', async () => {
  const response = await fetch('http://localhost:5000/run_forecast');
  const data = await response.json();
  return data;
});

export const forecastSlice = createSlice({
  name: 'forecast',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchForecastAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchForecastAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.forecast = action.payload;
      });
  },
});

// export const selectForecast = (state) => state.forecast.forecast;

export default forecastSlice.reducer;
