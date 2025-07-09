import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import store from "@src/redux/features";
import { Provider } from "react-redux";

// Application to Render
const app = 
<Provider store={store}>
<App />
</Provider>;

// Render application in DOM
createRoot(document.getElementById('root')).render(app);
