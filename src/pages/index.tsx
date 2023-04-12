import { useForm } from '@mantine/form';
import { TextInput, Checkbox, Button, Group, Box } from '@mantine/core';

export default function Home() {
    // Handles the submit event on form submit.
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
    const form = useForm({
      initialValues: {
        message: 'នេះគឺជាសំណួរមួយ',
      },
    });
    return (
      <Box maw={300} mx="auto">
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

    )
}

