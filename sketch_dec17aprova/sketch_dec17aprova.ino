const int LedPins[] = {30, 31, 32, 33, 36};  // Pin dei LED
const int EncoderPinA = 2;  // Pin A dell'encoder
const int EncoderPinB = 3;  // Pin B dell'encoder

volatile int encoderValue = 0;  // Contatore dell'encoder
const int numLeds = 5;  // Numero totale di LED
int currentLed = 0;  // LED attualmente acceso

// Pulsanti
const int Start = 13, Video = 12, Buy = 11;
bool Start_State, Video_State, Buy_State;

unsigned long lastEncoderTime = 0;  // Timer per il debounce

void setup() {
  Serial.begin(9600);

  // Configura i pin dei LED come output
  for (int i = 0; i < numLeds; i++) {
    pinMode(LedPins[i], OUTPUT);
  }

  // Configura i pin dell'encoder
  pinMode(EncoderPinA, INPUT_PULLUP);
  pinMode(EncoderPinB, INPUT_PULLUP);

  // Imposta le interruzioni per l'encoder
  attachInterrupt(digitalPinToInterrupt(EncoderPinA), readEncoder, CHANGE);

  // Configura i pin dei pulsanti
  pinMode(Start, INPUT);
  pinMode(Video, INPUT);
  pinMode(Buy, INPUT);

  // Accendi il primo LED all'avvio
  digitalWrite(LedPins[currentLed], HIGH);
}

void loop() {
  // Lettura ingressi digitali
  Start_State = digitalRead(Start);
  Video_State = digitalRead(Video);
  Buy_State = digitalRead(Buy);

  // Gestione del pulsante Start
  if (Start_State == HIGH) {
    Serial.println("Start pressed!");
    // Aggiungi qui il codice per l'azione di Start
  }

  // Gestione del pulsante Video
  if (Video_State == HIGH) {
    Serial.println("Video pressed!");
    // Aggiungi qui il codice per l'azione di Video
  }

  // Gestione del pulsante Buy
  if (Buy_State == HIGH) {
    Serial.println("Buy pressed!");
    // Aggiungi qui il codice per l'azione di Buy
  }

  // Aggiorna i LED in base al valore dell'encoder
  static int lastEncoderValue = 0;

  // Verifica se è passato abbastanza tempo per aggiornare il valore dell'encoder
  if (millis() - lastEncoderTime > 10) {  // Ritardo di 10ms per evitare aggiornamenti troppo rapidi
    if (encoderValue != lastEncoderValue) {
      // Spegni il LED corrente
      digitalWrite(LedPins[currentLed], LOW);

      // Aggiorna il LED: incremento o decremento di uno alla volta
      if (encoderValue > lastEncoderValue) {
        currentLed = (currentLed + 1) % numLeds;  // Incrementa il LED
      } else {
        currentLed = (currentLed - 1 + numLeds) % numLeds;  // Decrementa il LED
      }
      
      // Accendi il nuovo LED
      digitalWrite(LedPins[currentLed], HIGH);

      // Stampa il valore dell'encoder e il LED attivo per il debug
      Serial.print("Encoder Value: ");
      Serial.println(encoderValue);
      Serial.print("Current LED: ");
      Serial.println(currentLed + 1);

      lastEncoderValue = encoderValue;  // Aggiorna il valore dell'encoder

      // Aggiorna il timer dell'encoder
      lastEncoderTime = millis();
    }
  }
}

void readEncoder() {
  // Legge la direzione dell'encoder
  if (digitalRead(EncoderPinA) == digitalRead(EncoderPinB)) {
    encoderValue++;  // Incrementa
  } else {
    encoderValue--;  // Decrementa
  }
}
