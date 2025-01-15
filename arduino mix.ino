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
const int Start = 18, Video = 12, Buy = 19;
bool Start_State, Video_State, Buy_State;

// Variabili per la gestione del pulsante Start
unsigned long lastPressTime = 0;
const unsigned long shortPressTime = 1500;     // Durata massima per un "short press" (in millisecondi)
const unsigned long doublePressInterval = 500; // Intervallo massimo tra due pressioni per un "double press" (in millisecondi)
int pressCount = 0;                            // Contatore delle pressioni
bool lastStartState = HIGH;                    // Stato precedente del pulsante Start

// Variabili per la gestione del pulsante Video
unsigned long lastVideoPressTime = 0;
const unsigned long videoDebounceTime = 200; // Tempo di debounce per il pulsante Video

void setup()
{
    Serial.begin(9600);

    // Configura i pin dei pulsanti
    pinMode(Start, INPUT_PULLUP);
    pinMode(Video, INPUT_PULLUP);
    pinMode(Buy, INPUT_PULLUP);
}

void loop()
{
    // Lettura ingressi digitali
    Start_State = digitalRead(Start);
    Video_State = digitalRead(Video);
    Buy_State = digitalRead(Buy);

    // Stampa lo stato del pulsante Start solo se cambia
    if (Start_State != lastStartState)
    {
        Serial.print("Start State: ");
        Serial.println(Start_State);
        lastStartState = Start_State; // Aggiorna lo stato precedente
    }

    // Gestione del pulsante Start
    if (Start_State == LOW && (millis() - lastPressTime > doublePressInterval)) // Aggiunto debounce
    {
        pressCount++;             // Incrementa il contatore delle pressioni
        lastPressTime = millis(); // Aggiorna il tempo dell'ultima pressione

        // Gestione della pressione
        if (pressCount == 1)
        {
            Serial.println("Start pressed!"); // Stampa solo una volta per ogni pressione
        }
        else if (pressCount == 2)
        {
            Serial.println("Double press detected!");
            pressCount = 0; // Resetta il contatore dopo un doppio click
        }

        // Aggiungi un ritardo per evitare letture multiple immediate
        delay(100); // Debounce
    }
    else if (Start_State == HIGH && pressCount > 0) // Gestione del rilascio del pulsante
    {
        unsigned long pressDuration = millis() - lastPressTime;
        if (pressDuration > shortPressTime)
        {
            Serial.println("Short press detected!");
        }
        pressCount = 0; // Resetta il contatore dopo aver gestito la pressione
    }

    // Gestione del pulsante Video
    if (Video_State == LOW && (millis() - lastVideoPressTime > videoDebounceTime))
    {
        Serial.println("Video pressed!");
        lastVideoPressTime = millis(); // Aggiorna il tempo dell'ultima pressione
    }

    // Gestione del pulsante Buy
    if (Buy_State == LOW)
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