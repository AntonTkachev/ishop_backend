const getBaseURL = () => {
	const { REACT_APP_BASE_URL } = process.env;
	return REACT_APP_BASE_URL;
}

export default getBaseURL;