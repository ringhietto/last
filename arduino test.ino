#include "OneButton.h"
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
bool lastStartState = LOW; // Variabile per tracciare l'ultimo stato del pulsante Start

// Variabili per la gestione del pulsante Start
unsigned long lastPressTime = 0;
unsigned long pressDuration = 0;
int pressCount = 0;
const unsigned long shortPressTime = 1500;     // Durata massima per un "short press" (in millisecondi)
const unsigned long doublePressInterval = 200; // Intervallo massimo tra due pressioni per un "double press" (in millisecondi)
const unsigned long debounceDelay = 100;       // Ritardo per il debounce (in millisecondi)

// OneButton
OneButton button1(3, true);

bool buttonPressed = false; // Variabile per tracciare lo stato del pulsante

// Variabili per debounce
unsigned long debounce_duration = 50; // Durata del debounce (in millisecondi)
int previous_button_state = HIGH;     // Stato precedente del pulsante
int current_button_state = HIGH;      // Stato attuale del pulsante
unsigned long last_debounce_time = 0; // Tempo dell'ultimo cambiamento di stato del pulsante
unsigned long press_start_time;       // Tempo di inizio della pressione del pulsante
unsigned long release_time;           // Durata della pressione del pulsante

void setup()
{
  Serial.begin(9600);

  // Configura i pin dei pulsanti
  pinMode(Start, INPUT);
  pinMode(Video, INPUT);
  pinMode(Buy, INPUT);

  // Configura OneButton
  button1.attachClick(click1);
  button1.attachDoubleClick(doubleclick1);
  button1.attachDuringLongPress(longPress1);
}

void loop()
{
  // Lettura ingressi digitali
  Start_State = digitalRead(Start);
  Video_State = digitalRead(Video);
  Buy_State = digitalRead(Buy);

  // Gestione del pulsante Start con debounce
  if (debounced_button_press_check(Start, LOW))
  {
    press_start_time = millis(); // Registra il tempo di inizio della pressione
    while (!debounced_button_press_check(Start, HIGH))
      ;
    release_time = millis() - press_start_time; // Calcola la durata della pressione

    if (release_time > shortPressTime)
    {
      Serial.println("Long press detected");
    }
    else
    {
      // Controlla per singola o doppia pressione entro un intervallo di tempo specifico
      while (1)
      {
        if (debounced_button_press_check(Start, LOW))
        {
          Serial.println("Double click detected");
          break;
        }
        if ((millis() - press_start_time) > doublePressInterval)
        {
          Serial.println("Single click detected");
          break;
        }
      }
    }
    Serial.print("Durata della pressione: ");
    Serial.print(release_time);
    Serial.println(" ms"); // Stampa la durata della pressione
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

  // Gestione OneButton
  button1.tick();
  delay(10);
}

// Funzione per il debounce del pulsante
bool debounced_button_press_check(int pin, bool expected_state)
{
  int button_reading = digitalRead(pin);

  // Se lo stato del pulsante è cambiato, resetta il timer del debounce
  if (button_reading != previous_button_state)
  {
    last_debounce_time = millis();
  }
  previous_button_state = button_reading;

  // Se lo stato è rimasto stabile oltre la durata del debounce, consideralo valido
  if ((millis() - last_debounce_time) > debounce_duration)
  {
    if (button_reading != current_button_state)
    {
      current_button_state = button_reading;
      if (current_button_state == expected_state)
      {
        return true; // Ritorna true se lo stato desiderato è rilevato
      }
    }
  }
  return false; // Ritorna false se non è rilevata una pressione valida
}

void click1()
{
  Serial.println("Single click detected!");
}

void doubleclick1()
{
  Serial.println("Double click detected!");
}

void longPress1()
{
  Serial.println("Long press detected!");
}