"use client"
import { collection,doc,getDoc,setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import {useState, useEffect} from 'react'
import { useUser} from '@clerk/clerk-react'
import {Container,Typography,Grid, Card, CardContent, CardActionArea} from '@mui/material'
import {db} from "@/firebase";


export default function Flashcards() {
const { isLoaded, isSignedIn, user} = useUser() //clerk's hook
const [flashcards, setFlashcards] = useState([])
const router = useRouter()

useEffect(() => {
    async function getFlashcards() {
        if (!user) return 
        const docRef = doc(collection(db,'users'), user.id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()){
            const collections = docSnap.data().flashcardSets || []
            console.log(collections)
            setFlashcards(collections)
        }
        else{
            await setDoc(docRef, {flashcardSets: []})
        }
    }
    getFlashcards()
}, [user])


const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`)
  }

  return (
    <Container maxWidth="md">
    <Grid container spacing={3} sx={{ mt: 4 }}>
      {flashcards.map((flashcard, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {flashcard.name}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
))}
    </Grid>
  </Container>
    
  )
}
