import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url, cookies }) => {
	const recruiterParam = url.searchParams.get('recruiter');
	
	if (recruiterParam !== null) {
		const isRecruiterValue = recruiterParam === '1';
		
		if (isRecruiterValue) {
			// Set cookie for recruiter mode
			cookies.set('isRecruiter', '1', {
				path: '/',
				maxAge: 60 * 60 * 24 * 3, // 3 days
				sameSite: 'strict'
			});
		} else {
			// Delete cookie when switching back to regular mode
			cookies.delete('isRecruiter', { path: '/' });
		}
		
		return {
			isRecruiter: isRecruiterValue
		};
	}
	
	const recruiterCookie = cookies.get('isRecruiter');
	
	return {
		isRecruiter: recruiterCookie ? recruiterCookie === '1' : false
	};
};