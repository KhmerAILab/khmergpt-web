import { useForm } from '@mantine/form';
import { TextInput, Checkbox, Button, Group, Box } from '@mantine/core';
import { signIn, signOut, useSession } from "next-auth/react";

const Home = () => {
    // Handles the submit event on form submit.
    const { data: session, status } = useSession();
    const form = useForm({
      initialValues: {
        message: 'នេះគឺជាសំណួរមួយ',
      },
    });
    if (status === "loading") {
      return <main>Loading...</main>;
    }

    const handleSubmit = async (message: string) => {
      const data = {
        message: message,
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
      const res = await fetch(endpoint, options);
      const result = await res.json();
      alert(`Response: ${result.data}`)
    }
    return (
      <main>
      <div>
        {session ? (
          <>
            <Box maw={300} mx="auto">
              <p>hi {session.user?.name}</p>
              <button
                onClick={() => {
                  signOut().catch(console.log);
                }}
                >
                Logout
              </button>
                <form onSubmit={form.onSubmit((values) => handleSubmit(values.message))}>
                <TextInput
                withAsterisk
                label="Prompt"
                placeholder="Prompt Here"
                {...form.getInputProps('message')}
                />

                <Group position="right" mt="md">
                <Button type="submit">Submit</Button>
                </Group>
                </form>
            </Box>

          </>
        ) : (
          <Box maw={300} mx="auto">
          <button
            onClick={() => {
              signIn("discord").catch(console.log);
            }}
          >
            Login with Discord
           </button>
           </Box>
        )}
      </div>
    </main>

    )
}

export default Home;
