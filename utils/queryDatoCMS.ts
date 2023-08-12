export default async function queryDatoCMS(
  query: string,
  variables = {},
  isDraft = false
) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${process.env.DATOCMS_READONLY_API_TOKEN}`,
  };

  if (isDraft) {
    headers['X-Include-Drafts'] = true;
  }

  try {
    const { data } = await (
      await fetch('https://graphql.datocms.com/', {
        // cache: 'no-store', //only use during development
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables,
        }),
      })
    ).json();

    return data;
  } catch (error) {
    console.log('Error on query \n\n' + query);
    throw error;
  }
}
