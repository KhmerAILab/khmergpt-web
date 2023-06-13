import { useForm } from '@mantine/form';
import { TextInput, Checkbox, Button, Group, Box, ButtonProps, Alert } from '@mantine/core';
import { signIn, signOut, useSession } from "next-auth/react";
import { GithubIcon, DiscordIcon } from '@mantine/ds';
import { IconAlertCircle } from '@tabler/icons-react';
import React, { useState } from "react";

const [message, setMessage] = useState("")
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
    
    const showAlert = (msg) =>{
        setMessage(msg);
      };
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
      showAlert(`Response: ${result.data}`)
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
                {message && <p>{message}</p>}
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
          <Group position="center" sx={{ padding: 15 }}>
            
            <DiscordButton>Login with Discord</DiscordButton>
            <GithubButton>Login with GitHub</GithubButton>

          </Group>
           
        )}
      </div>
    </main>

    )
}
export function GithubButton(props: ButtonProps) {
  return (
    <Button
      onClick={() => {
        signIn("github").catch(console.log);
      }}
      {...props}
      leftIcon={<GithubIcon size="1rem" />}
      sx={(theme) => ({
        backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
        color: '#fff',
        '&:hover': {
          backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
        },
      })}
    />
  );
}

export function DiscordButton(props: ButtonProps) {
  return (
    <Button
      onClick={() => {
        signIn("discord").catch(console.log);
      }}
      leftIcon={<DiscordIcon size="1rem" />}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? '#5865F2' : '#5865F2',
        '&:not([data-disabled]):hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.fn.lighten('#5865F2', 0.05)
              : theme.fn.darken('#5865F2', 0.05),
        },
      })}
      {...props}
    />
  );
}

export default Home;
