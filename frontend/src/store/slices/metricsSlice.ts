// src/store/slices/metricsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SystemMetric, MetricsState } from '../../types/metrics';
import { websocketService } from '../../utils/websocketService';

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

// src/store/slices/metricsSlice.ts

interface WebSocketInitStatus {
  status: 'connected' | 'failed';
  error?: string;
}
interface WebSocketMessage {
  type: string;
  data?: SystemMetric;
}

export const initializeWebSocket = createAsyncThunk(
  'metrics/initializeWebSocket',
  async (_, { dispatch }) => {
      console.log("🚀 Initializing WebSocket connection...");
      
      try {
          // Set the callback BEFORE connecting
          websocketService.setMessageCallback((data: WebSocketMessage) => {
              console.log("📨 WebSocket message received in callback:", data);
              
              if (data.type === 'metrics_update' && data.data) {
                  console.log("📊 Dispatching metric update:", data.data);
                  dispatch(updateMetrics(data.data));
              } else {
                  console.warn("⚠️ Unexpected message type:", data.type);
              }
          });

          // Then connect
          await websocketService.connect();

          // Check if connection was successful
          if (websocketService.isConnected()) {
              console.log("✅ WebSocket connected successfully");
          } else {
              console.warn("⚠️ WebSocket not connected after initialization");
          }

          return { status: 'connected' } as WebSocketInitStatus;
      } catch (error) {
          console.error("💩 WebSocket initialization failed:", error);
          return {
              status: 'failed',
              error: error instanceof Error ? error.message : 'Unknown WebSocket fuckup'
          } as WebSocketInitStatus;
      }
  }
);
export const fetchSystemMetrics = createAsyncThunk<
  MetricsApiResponse,
  void,
  { rejectValue: string }
>('metrics/fetch', async (_, { rejectWithValue }) => {
  try {
 // Get auth token from localStorage
 const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
 // Get CSRF token from cookies with better error handling
 const getCookie = (name: string): string | null => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  } catch (error) {
    console.error("🍪 Cookie retrieval fucked up:", error);
    return null;
  }
};
    
const csrfToken = getCookie('csrftoken');

console.log("🔐 Auth Check:", {
  hasToken: !!token,
  hasCsrf: !!csrfToken,
  tokenPreview: token ? `${token.slice(0, 5)}...` : 'none'
});

const options: RequestInit = {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken || '',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
};

console.log("🚀 Sending request with headers:", {
  ...options.headers,
  Authorization: token ? 'Bearer [REDACTED]' : 'none'
});

const response = await fetch('/api/metrics/', options);

if (!response.ok) {
  throw new Error(`API returned ${response.status}: ${response.statusText}`);
}

return await response.json() as MetricsApiResponse;
} catch (error) {
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



export const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    updateMetrics: (state, action: PayloadAction<SystemMetric>) => {
      console.log("🎭 REDUX BEFORE UPDATE:", {
          current: state.current,
          historicalLength: state.historical.length
      });
      
      state.current = action.payload;
      state.historical = [...state.historical.slice(-19), action.payload];
      state.lastUpdated = new Date().toISOString();
      
      console.log("🎭 REDUX AFTER UPDATE:", {
          current: state.current,
          historicalLength: state.historical.length,
          lastUpdated: state.lastUpdated
      });
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
      .addCase(initializeWebSocket.fulfilled, (state, _action) => {
        state.error = null;
      })
      .addCase(initializeWebSocket.rejected, (state, action) => {
        state.error = 'Websocket fucked off again: ' + action.error.message;
      });
    }
  });
      
export const { updateMetrics, clearMetrics } = metricsSlice.actions; 
export default metricsSlice.reducer;
