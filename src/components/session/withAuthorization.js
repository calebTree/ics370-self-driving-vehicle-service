import React from 'react';
import { withRouter } from 'react-router-dom';

import { withFirebase } from '../firebase';

const withAuthorization = condition => Component => {
	class WithAuthorization extends React.Component {
		componentDidMount() {
			// protected page
			this.listener = this.props.firebase.auth.onAuthStateChanged (
				authUser => {
					if (!condition(authUser)) {
						this.props.history.push('/welcome');
					}
				},
			);
		}
		componentWillUnmount() {
			this.listener();
		}

		render() {
			return (
				<Component {...this.props} />
			);
		}
	}
	return withRouter(withFirebase(WithAuthorization));
};

export default withAuthorization;
