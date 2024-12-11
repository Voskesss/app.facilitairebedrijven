export const fetchUserProfile = async (token: string) => {
  const response = await fetch('/wp-json/wp/v2/users/me?context=edit', {
    headers: { 
      'Authorization': `Bearer ${token}`
    },
  });
  
  if (!response.ok) {
    throw new Error('Kon gebruikersprofiel niet ophalen');
  }
  
  const data = await response.json();
  console.log('WordPress user data:', data); // Om te zien welke velden beschikbaar zijn
  return data;
}; 