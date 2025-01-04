#include <Encoder.h>

// Pin dell'encoder
const int EncoderPinA = 2;
const int EncoderPinB = 3;

// Inizializza l'oggetto encoder
Encoder myEnc(EncoderPinA, EncoderPinB);

long oldEncoderValue = 0;     // Valore precedente dell'encoder (tipo long)
long selectedValue = 0;       // Valore selezionato dall'encoder (potrebbe essere un'opzione, una quantità, ecc.)
const int encoderDivisor = 4; // Divisore per ridurre il numero di conteggi

// Pulsanti
const int Start = 13, Video = 12, Buy = 11;
bool Start_State, Video_State, Buy_State;

// Variabili per la gestione del pulsante Start
unsigned long lastPressTime = 0;
unsigned long pressDuration = 0;
int pressCount = 0;
const unsigned long shortPressTime = 500;      // Durata massima per un "short press" (in millisecondi)
const unsigned long doublePressInterval = 300; // Intervallo massimo tra due pressioni per un "double press" (in millisecondi)

void setup()
{
  Serial.begin(9600);

  // Configura i pin dei pulsanti
  pinMode(Start, INPUT);
  pinMode(Video, INPUT);
  pinMode(Buy, INPUT);
}

void loop()
{
  // Lettura ingressi digitali
  Start_State = digitalRead(Start);
  Video_State = digitalRead(Video);
  Buy_State = digitalRead(Buy);

  // Gestione del pulsante Start
  if (Start_State == HIGH)
  {
    // Se è la prima pressione o se è passato più di 1 secondo dall'ultima pressione
    if (pressCount == 0 || (millis() - lastPressTime > doublePressInterval))
    {
      pressCount = 1; // Inizia il conteggio delle pressioni
      Serial.println("Start pressed!"); // Stampa solo una volta per ogni pressione
    }
    else if (pressCount == 1 && (millis() - lastPressTime <= doublePressInterval))
    {
      pressCount++; // Incrementa il contatore solo se è una seconda pressione entro l'intervallo
    }
    
    lastPressTime = millis(); // Aggiorna il tempo dell'ultima pressione

    // Aggiungi un ritardo per evitare letture multiple immediate
    delay(100); // Debounce
  }
  else
  {
    // Gestisci il rilascio del pulsante
    if (pressCount > 0)
    {
      pressDuration = millis() - lastPressTime;
      if (pressDuration > shortPressTime)
      {
        if (pressCount == 1)
        {
          Serial.println("Short press detected!");
        }
        else if (pressCount == 2)
        {
          Serial.println("Double press detected!");
        }
        Serial.print("Durata della pressione: ");
        Serial.print(pressDuration);
        Serial.println(" ms"); // Stampa la durata della pressione
        pressCount = 0; // Resetta il contatore dopo aver gestito la pressione
      }
    }
  }

  // Gestione del pulsante Video
  if (Video_State == HIGH)
  {
    Serial.println("Video pressed!");
  }

  // Gestione del pulsante Buy
  if (Buy_State == HIGH)
  {
    Serial.println("Buy pressed!");
  }

  // Leggi la posizione corrente dell'encoder
  long newEncoderValue = myEnc.read();

  // Verifica se l'encoder ha cambiato posizione
  if (newEncoderValue != oldEncoderValue)
  {
    // Calcola il nuovo valore da selezionare (incrementa/decrementa di 1)
    if (newEncoderValue % encoderDivisor == 0)
    {
      if (newEncoderValue > oldEncoderValue)
      {
        selectedValue++; // Incrementa il valore
      }
      else
      {
        selectedValue--; // Decrementa il valore
      }

      // Stampa il valore selezionato per il debug
      Serial.print("Selected Value: ");
      Serial.println(selectedValue);

      oldEncoderValue = newEncoderValue; // Aggiorna il valore precedente dell'encoder
    }
  }
}