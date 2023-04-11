export default function Home() {
    // Handles the submit event on form submit.
    const handleSubmit = async (event: any) => {

      event.preventDefault()

      const data = {
        message: event.target.message.value,
      }
      const JSONdata = JSON.stringify(data)

      const endpoint = '/api/generate'
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSONdata,
      }
      const res = await fetch(endpoint, options)
      const result = await res.json()
      alert(`Response: ${result.data}`)
    }
    return (
      // We pass the event to the handleSubmit() function on submit.
      <form onSubmit={handleSubmit}>
        <label htmlFor="message">Ask Here</label>
        <input type="text" id="message" name="message" required />

        <button type="submit">Submit</button>
      </form>
    )
}

