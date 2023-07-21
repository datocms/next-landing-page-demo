export default async function queryDatoCMS(query: string) {
  try {
    const { data } = await (
      await fetch('https://graphql.datocms.com/', {
        cache: 'no-store', //only use during development
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.DATOCMS_READONLY_API_TOKEN}`,
        },
        body: JSON.stringify({
          query,
        }),
      })
    ).json();

    return data;
  } catch (error) {
    console.log('Error on query \n\n' + query);
    throw error;
  }
}
