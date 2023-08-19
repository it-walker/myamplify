import { API, GRAPHQL_AUTH_MODE } from '@aws-amplify/api'
import { Storage } from 'aws-amplify'
import { useEffect, useState } from "react"

import { createTodo } from '../graphql/mutations'
import { listTodos } from '../graphql/queries'
import { S3 } from './S3'

export function DynamoDB() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    try {
      const response = await API.graphql({
        query: listTodos,
      })
      const todosData = response.data.listTodos.items
      setTodos(todosData)
    } catch (err) {
      console.log('error fetching books...', err)
    }
  }

  const handletitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleDescriptionChange = async (event) => {
    setDescription(event.target.value)
  }

  const handleImageChange = (event) => {
    setImage(event.target.files[0])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const stored = await Storage.put(image.name, image, {
        contentType: image.type,
      })

      const todoDetails = {
        title,
        description,
        image: stored.key,
      }
      const newTodo = await API.graphql({
        query: createTodo,
        variables: { input: todoDetails },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })
      console.log('投稿しました。', newTodo)
      alert('投稿に成功しました。')
      fetchTodos()
    } catch (error) {
      console.error('投稿に失敗しました。', error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={handletitleChange}/>
        </label>
        <br/>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={handleDescriptionChange}
          />
        </label>
        <br/>
        <label>
          Image:
          <input type="file" onChange={handleImageChange}/>
        </label>
        <br/>
        <button type="submit">Create Post</button>
      </form>
      <ol>
        {todos.map((todo) => (
          <li key={todo.id}>
            <S3
              title={todo.title}
              description={todo.description}
              image={todo.image}
            />
          </li>
        ))}
      </ol>
    </div>
  )
}
