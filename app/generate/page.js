'use client'

import { useState } from 'react'
import { collection, getDoc, setDoc, doc, writeBatch } from 'firebase/firestore'
import {
  Container, TextField, Button, Typography, Box, Grid, Card, CardContent,
  Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions,
  CardActionArea, CircularProgress
} from '@mui/material'
import { db } from "@/firebase";
import { useUser } from '@clerk/clerk-react'
import { useRouter } from 'next/navigation'

export default function Generate() {
  const { user } = useUser()
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false) // New loading state
  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)
  const router = useRouter()

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.')
      return
    }

    try {
      const userDocRef = doc(collection(db, 'users'), user.id)
      const userDocSnap = await getDoc(userDocRef)
      const batch = writeBatch(db)

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
        batch.update(userDocRef, { flashcardSets: updatedSets })
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
      }

      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
      batch.set(setDocRef, { flashcards })

      await batch.commit()

      alert('Flashcards saved successfully!')
      handleCloseDialog()
      setSetName('')
      router.push('/flashcards')
    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
    }
  }

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }

    setLoading(true) // Set loading to true when the request starts

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })

      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }

      const data = await response.json()
      setFlashcards(data)
      console.log(data)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    } finally {
      setLoading(false) // Set loading to false when the request finishes
    }
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <Container maxWidth="md" sx={{ bgcolor: '#121212', color: '#FFF' }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="#FFA500">
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{
            mb: 2, bgcolor: '#1E1E1E', color: '#FFF', label: { color: '#FFF' },
            '& .MuiOutlinedInput-root': { color: '#FFF' }
          }}
          InputLabelProps={{ style: { color: '#FFA500' } }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ bgcolor: '#FFA500', color: '#121212' }}
        >
          Generate Flashcards
        </Button>
      </Box>

      {loading ? ( // Show loading spinner while flashcards are being generated
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: '#FFA500' }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Generating Flashcards...
          </Typography>
        </Box>
      ) : (
        flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom color="#FFA500">
              Generated Flashcards
            </Typography>
            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ bgcolor: flipped[index] ? '#FFA500' : '#1E1E1E', color: '#FFF' }}>
                    <CardActionArea
                      onClick={() => {
                        handleCardClick(index)
                      }}>
                      <CardContent>
                        <Box sx={{
                          perspective: "1000px",
                          '& > div': {
                            transition: "transform 0.6s",
                            transformStyle: "preserve-3d",
                            position: "relative",
                            width: "100%",
                            height: "200px",
                            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          },
                          '& > div > div': {
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: 'hidden',
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 2,
                            boxSizing: 'border-box'
                          },
                          '& > div > div:nth-of-type(2)': {
                            transform: 'rotateY(180deg)'
                          },
                        }}>
                          <div>
                            <div>
                              <Typography variant="h6" component="div">
                                {flashcard.front}
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="h6" component="div">
                                {flashcard.back}
                              </Typography>
                            </div>
                          </div>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )
      )}

      {flashcards.length > 0 && !loading && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{ bgcolor: '#FFA500', color: '#121212' }}>
            Save Flashcards
          </Button>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            sx={{
              bgcolor: '#1E1E1E', color: '#FFF',
              '& .MuiOutlinedInput-root': { color: '#FFF' }
            }}
            InputLabelProps={{ style: { color: '#FFA500' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#FFA500' }}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary" sx={{ bgcolor: '#FFA500', color: '#121212' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
