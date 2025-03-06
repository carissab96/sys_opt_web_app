// src/store/slices/metricsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SystemMetric, MetricsState } from '../../types/metrics';
import { MetricsWebSocket } from '../../utils/websocket';
// Add this type definition
// type IntervalID = ReturnType<typeof setInterval>;

const initialState: MetricsState = {
  current: null,
  historical: [],
  alerts: [],
  thresholds: {
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
  },
  loading: false,
  error: null,
  lastUpdated: null,
  websocketInstance: null as MetricsWebSocket | null  
};

interface MetricsApiResponse {
  data: SystemMetric;
  timestamp: string;
  }

type MetricsFuckup = 
| "The API is having a fucking existential crisis"
| "TypeScript ate our metrics and left a strongly-typed note"
| "The quantum shadow people finally got to the router"
| "The Meth Snail's tin foil hat interfered with the signal"
| "Sir Hawkington knocked over the server with his monocle"
| "The Stick fainted from improper type definitions again";

export const initializeWebSocket = createAsyncThunk(
  'metrics/initializeWebSocket',
  async (_, { dispatch }) => {
      const ws = new MetricsWebSocket();
      
      ws.setMessageCallback((data) => {
          if (data.type === 'metrics_update') {
              dispatch(fetchSystemMetrics());
          }
      });

      return ws;
  }
);
export const fetchSystemMetrics = createAsyncThunk<
  MetricsApiResponse,
  void,
  { rejectValue: string }
>('metrics/fetch', async (_, { rejectWithValue }) => {
  try {
    // Define headers properly
    const options: RequestInit = {
     method: 'GET',
     credentials: 'include',
     headers: {
      'Content-Type': 'application/json',
     }
    };

    const response = await fetch('/api/metrics/', options);

  if (!response.ok) {
    throw new Error('The metrics API told us to fuck right off');
  }

  return await response.json() as MetricsApiResponse;
} catch (error: unknown) {
  const randomFuckup = Math.floor(Math.random() * 6);
  const fuckups: MetricsFuckup[] = [
    "The API is having a fucking existential crisis",
    "TypeScript ate our metrics and left a strongly-typed note",
    "The quantum shadow people finally got to the router",
    "The Meth Snail's tin foil hat interfered with the signal",
    "Sir Hawkington knocked over the server with his monocle",
    "The Stick fainted from improper type definitions again"
  ];
  
  const baseError = error instanceof Error 
    ? error.message 
    : "We don't know what the actual fuck happened. It's like trying to understand TypeScript's feelings";
  
  return rejectWithValue(
    `Failed to fetch the fucking metrics: ${baseError}. ` +
    `Additional Info: ${fuckups[randomFuckup]}. ` +
    `Have you tried turning it off and on again, or perhaps offering TypeScript a cup of tea?`
  );
}
});

// export const startMetricsPolling = createAsyncThunk<
//   IntervalID,  // Specify return type
//   void,
//   { rejectValue: string }
// >('metrics/startPolling', async (_, { dispatch }) => {
//   const intervalId: IntervalID = setInterval(() => {
//     dispatch(fetchSystemMetrics());
//   }, 5000);

//   return intervalId;
// });

// export const stopMetricsPolling = createAsyncThunk<
//   void,
//   IntervalID,  // Specify parameter type
//   { rejectValue: string }
// >('metrics/stopPolling', async (intervalId) => {
//   clearInterval(intervalId);
// });

const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    updateMetrics: (state, action: PayloadAction<SystemMetric>) => {
      state.current = action.payload;
      state.historical = [
      ...state.historical.slice(-19),
      action.payload
      ];
      state.lastUpdated = new Date().toISOString();
      },
      clearMetrics: (state) => {
      state.current = null;
      state.historical = [];
      state.alerts = [];
      state.thresholds = {
      cpu: 0,
      memory: 0,
      disk: 0,
      network: 0,
      };
      state.lastUpdated = null;
      }
      },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemMetrics.pending, (state) => {  
      state.loading = true;
      state.error = null;
      })

      .addCase(fetchSystemMetrics.fulfilled, (state, action) => {
      state.loading = false;
      state.current = action.payload.data;
      state.historical = [
      ...state.historical.slice(-19),
      action.payload.data
      ];
      state.lastUpdated = action.payload.timestamp;
      })

      .addCase(fetchSystemMetrics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch metrics';
      })
      .addCase(initializeWebSocket.fulfilled, (state, action) => {
        state.websocketInstance = action.payload;
        state.error = null;
      })
      .addCase(initializeWebSocket.rejected, (state, action) => {
        state.websocketInstance = null;
        state.error = 'Websocket fucked off again: ' + action.error.message;
      });
    }
  });
      // .addCase(startMetricsPolling.fulfilled, (state: { pollingInterval: any; }, action: { payload: any; }) => {
      //   state.pollingInterval = action.payload;
      // })

      // .addCase(stopMetricsPolling.fulfilled, (state: { pollingInterval: any; }, action: { payload: any; }) => {
      //   state.pollingInterval = action.payload; 
      // });
 
export default metricsSlice.reducer;