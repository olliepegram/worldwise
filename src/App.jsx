import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Product from './pages/Product';
import Homepage from './pages/Homepage';
import Pricing from './pages/Pricing';
import PageNotFound from './pages/PageNotFound';
import AppLayout from './pages/AppLayout';
import Login from './pages/Login';
import CityList from './components/CityList';
import { useEffect, useState } from 'react';
import CountryList from './components/CountryList';

const URL = 'http://localhost:8000';

function App() {
	const [cities, setCities] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		async function fetchCities() {
			try {
				setIsLoading(true);
				const res = await fetch(`${URL}/cities`);
				const data = await res.json();
				setCities(data);
			} catch {
				alert('There was an error fetching the data');
			} finally {
				setIsLoading(false);
			}
		}
		fetchCities();
	}, []);

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						index
						element={<Homepage />}
					/>
					<Route
						path='product'
						element={<Product />}
					/>
					<Route
						path='pricing'
						element={<Pricing />}
					/>
					<Route
						path='login'
						element={<Login />}
					/>
					<Route
						path='app'
						element={<AppLayout />}
					>
						<Route
							index
							element={
								<CityList
									cities={cities}
									isLoading={isLoading}
								/>
							}
						/>
						<Route
							path='cities'
							element={
								<CityList
									cities={cities}
									isLoading={isLoading}
								/>
							}
						/>
						<Route
							path='countries'
							element={
								<CountryList
									cities={cities}
									isLoading={isLoading}
								/>
							}
						/>
						<Route
							path='form'
							element={<p>Form</p>}
						/>
					</Route>
					<Route
						path='*'
						element={<PageNotFound />}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
