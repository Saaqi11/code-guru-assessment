import './bootstrap.js';
import React from 'react';
import {createRoot} from "react-dom/client";
import Index from './src/index.jsx';
import './../scss/app.scss';

if (document.getElementById('app')) {
	createRoot(document.getElementById('app')).render(<Index />);
}
