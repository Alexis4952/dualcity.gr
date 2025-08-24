import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, AlertTriangle, BadgeIcon as Police, Banknote } from "lucide-react"
import Navbar from "@/components/navbar"
import BackButton from "@/components/back-button"
import Footer from "@/components/footer"

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
      <BackButton />
      <Navbar />

      {/* Space Background - Applied to entire page */}
      <div className="fixed inset-0 z-0">
        {/* Deep space background */}
        <div className="absolute inset-0 bg-[#030014]"></div>

        {/* Stars */}
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>

        {/* Distant galaxies/nebulae */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-purple-900/10 blur-[150px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1/3 h-1/3 rounded-full bg-blue-900/10 blur-[100px]"></div>
        <div className="absolute top-1/3 right-1/3 w-1/4 h-1/4 rounded-full bg-pink-900/10 blur-[120px]"></div>
      </div>

      {/* Rules Content */}
      <div className="relative z-10 pt-24 pb-16 px-4 flex-grow">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600">
              Κανόνες Server
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Παρακαλούμε διαβάστε προσεκτικά τους κανόνες πριν συνδεθείτε στον server μας
            </p>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-8 bg-gray-900/50">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden md:inline">Βασικοί</span>
              </TabsTrigger>
              <TabsTrigger value="roleplay" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Roleplay</span>
              </TabsTrigger>
              <TabsTrigger value="criminal" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden md:inline">Εγκληματικοί</span>
              </TabsTrigger>
              <TabsTrigger value="police" className="flex items-center gap-2">
                <Police className="h-4 w-4" />
                <span className="hidden md:inline">LSPD & EMS</span>
              </TabsTrigger>
              <TabsTrigger value="robbery" className="flex items-center gap-2">
                <Banknote className="h-4 w-4" />
                <span className="hidden md:inline">Ληστείες</span>
              </TabsTrigger>
            </TabsList>

            {/* Basic Rules */}
            <TabsContent value="basic">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-cyan-400">Βασικοί Κανόνες</CardTitle>
                  <CardDescription className="text-gray-400">
                    Οι θεμελιώδεις κανόνες που πρέπει να ακολουθούν όλοι οι παίκτες
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-cyan-500">
                      <h3 className="font-bold text-lg mb-2">Χρήση Μικροφώνου</h3>
                      <p className="text-gray-300">
                        Η χρήση μικροφώνου είναι απαραίτητη. Εάν χρησιμοποιείτε voice changer, η αλλοίωση της φωνής
                        πρέπει να είναι ρεαλιστική και όχι υπερβολική.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-cyan-500">
                      <h3 className="font-bold text-lg mb-2">Ρεαλιστικό Όνομα</h3>
                      <p className="text-gray-300">
                        Ο χαρακτήρας σας πρέπει να έχει ένα ρεαλιστικό όνομα που να μην σχετίζεται με usernames από
                        άλλες πλατφόρμες (Discord, Steam).
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-cyan-500">
                      <h3 className="font-bold text-lg mb-2">Επικοινωνία</h3>
                      <p className="text-gray-300">
                        Η επικοινωνία εντός παιχνιδιού πρέπει να γίνεται μέσω του ραδιοφώνου του server και όχι μέσω
                        εξωτερικών εφαρμογών.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-cyan-500">
                      <h3 className="font-bold text-lg mb-2">Παραβίαση Κανόνων</h3>
                      <p className="text-gray-300">
                        Σε περίπτωση παραβίασης κανόνων, συνεχίζετε το roleplay και καταθέτετε /report.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-cyan-500">
                      <h3 className="font-bold text-lg mb-2">Τοξικότητα</h3>
                      <p className="text-gray-300">
                        Κάθε μορφή τοξικότητας, ρατσιστικής ή προκατειλημμένης συμπεριφοράς απαγορεύεται αυστηρά και
                        τιμωρείται.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Roleplay Rules */}
            <TabsContent value="roleplay">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-pink-400">Κανόνες Roleplay</CardTitle>
                  <CardDescription className="text-gray-400">
                    Κανόνες που διασφαλίζουν την ποιότητα του roleplay στον server
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-pink-500">
                      <h3 className="font-bold text-lg mb-2">Ρεαλιστική Απόδοση Ρόλου</h3>
                      <p className="text-gray-300">Οι παίκτες πρέπει να διατηρούν το in-character ανά πάσα στιγμή.</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-pink-500">
                      <h3 className="font-bold text-lg mb-2">Άρνηση RP</h3>
                      <p className="text-gray-300">
                        Απαγορεύεται η αποφυγή αλληλεπίδρασης ή η άρνηση συμμετοχής σε RP σκηνές.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-pink-500">
                      <h3 className="font-bold text-lg mb-2">New Life Rule (NLR)</h3>
                      <p className="text-gray-300">
                        Εάν μεταφερθείτε στο νοσοκομείο μετά από τραυματισμό, δεν επιτρέπεται να θυμάστε γεγονότα που
                        προηγήθηκαν.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-pink-500">
                      <h3 className="font-bold text-lg mb-2">Metagaming</h3>
                      <p className="text-gray-300">
                        Η χρήση πληροφοριών που αποκτήθηκαν εκτός του παιχνιδιού για προσωπικό όφελος δεν επιτρέπεται.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-pink-500">
                      <h3 className="font-bold text-lg mb-2">Powergaming</h3>
                      <p className="text-gray-300">
                        Οι ενέργειες του χαρακτήρα σας πρέπει να βασίζονται σε ρεαλιστικά δεδομένα.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-pink-500">
                      <h3 className="font-bold text-lg mb-2">Value of Life (VoL)</h3>
                      <p className="text-gray-300">
                        Σε οποιοδήποτε ένοπλο σενάριο, πρέπει να διατηρείτε τον φόβο για τη ζωή του χαρακτήρα σας.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-pink-500">
                      <h3 className="font-bold text-lg mb-2">Random Deathmatch (RDM)</h3>
                      <p className="text-gray-300">
                        Απαγορεύεται η δολοφονία άλλου παίκτη χωρίς τουλάχιστον δύο λεπτά αλληλεπίδρασης.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-pink-500">
                      <h3 className="font-bold text-lg mb-2">Combat Logging</h3>
                      <p className="text-gray-300">
                        Απαγορεύεται η αποσύνδεση κατά τη διάρκεια ενός σεναρίου για αποφυγή συνεπειών.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Criminal Rules */}
            <TabsContent value="criminal">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-400">Κανόνες Εγκληματικών Δραστηριοτήτων</CardTitle>
                  <CardDescription className="text-gray-400">
                    Κανόνες που διέπουν τις εγκληματικές δραστηριότητες στον server
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-bold text-lg mb-2">Roleplay & Έγκλημα</h3>
                      <p className="text-gray-300">
                        Οι εγκληματικές ενέργειες πρέπει να περιλαμβάνουν ουσιαστικό roleplay.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-bold text-lg mb-2">Μέγιστος Αριθμός Μελών</h3>
                      <p className="text-gray-300">
                        Ο μέγιστος αριθμός μελών ανά εγκληματική ομάδα είναι 12. Το LSPD δεν έχει όριο.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-bold text-lg mb-2">Υπεροχή Αριθμών</h3>
                      <p className="text-gray-300">
                        Για να επιτεθείτε σε αντίπαλη ομάδα, πρέπει να έχετε αριθμητική υπεροχή τουλάχιστον +2 ατόμων.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-bold text-lg mb-2">Εγκληματικές Περιοχές</h3>
                      <p className="text-gray-300">
                        Οι εγκληματικές ενέργειες επιτρέπονται μόνο σε συγκεκριμένες περιοχές.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-bold text-lg mb-2">Ομοιομορφία</h3>
                      <p className="text-gray-300">
                        Τα μέλη μιας εγκληματικής ομάδας πρέπει να έχουν αντίστοιχο ρουχισμό κατά τη διάρκεια μιας
                        επιχείρησης.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-bold text-lg mb-2">Server Restart</h3>
                      <p className="text-gray-300">
                        Οι εγκληματικές δραστηριότητες απαγορεύονται 30 λεπτά πριν από το server restart.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Police & EMS Rules */}
            <TabsContent value="police">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-400">Κανόνες LSPD & EMS</CardTitle>
                  <CardDescription className="text-gray-400">
                    Κανόνες για τις υπηρεσίες έκτακτης ανάγκης
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                      <h3 className="font-bold text-lg mb-2">Cop Baiting</h3>
                      <p className="text-gray-300">
                        Η πρόκληση καταδίωξης της αστυνομίας με τεχνητό τρόπο απαγορεύεται.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                      <h3 className="font-bold text-lg mb-2">EMS & Αστυνομία</h3>
                      <p className="text-gray-300">
                        Οι EMS δεν επιτρέπεται να παρευρίσκονται σε εγκληματικές τοποθεσίες χωρίς αστυνομική συνοδεία.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                      <h3 className="font-bold text-lg mb-2">Περιορισμός Αναστάσεων</h3>
                      <p className="text-gray-300">
                        Ένα άτομο δεν μπορεί να αναστηθεί περισσότερες από μία φορές στην ίδια σκηνή.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Robbery Rules */}
            <TabsContent value="robbery">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-400">Κανόνες Ληστειών & Εξαγορών</CardTitle>
                  <CardDescription className="text-gray-400">
                    Κανόνες που διέπουν τις ληστείες και τις απαγωγές
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-green-500">
                      <h3 className="font-bold text-lg mb-2">Αναλογία LSPD - Criminal</h3>
                      <div className="text-gray-300">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Minimarket: 1-2 Criminals</li>
                          <li>Μικρή Τράπεζα: 2-4 Criminals</li>
                          <li>Κοσμηματοπωλείο: 2-5 Criminals</li>
                          <li>Μεγάλη Τράπεζα: 3-6 Criminals</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-green-500">
                      <h3 className="font-bold text-lg mb-2">Εμπλοκή Τρίτων</h3>
                      <p className="text-gray-300">Απαγορεύεται η εμπλοκή τρίτων σε ενεργές ληστείες.</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-green-500">
                      <h3 className="font-bold text-lg mb-2">Διαπραγματεύσεις</h3>
                      <p className="text-gray-300">
                        Οι διαπραγματεύσεις με το LSPD πρέπει να τηρούνται και να μην παραβιάζονται με αιφνίδιες
                        επιθέσεις.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-green-500">
                      <h3 className="font-bold text-lg mb-2">Chase Rules</h3>
                      <p className="text-gray-300">
                        Οι εγκληματίες δεν επιτρέπεται να αλλάζουν όχημα ή ρούχα ή να εισέρχονται σε κτίρια για 15 λεπτά
                        μετά την έναρξη της καταδίωξης.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-green-500">
                      <h3 className="font-bold text-lg mb-2">Χρόνος Αναμονής Αστυνομίας</h3>
                      <p className="text-gray-300">
                        Αν η αστυνομία δεν εμφανιστεί μέσα σε 20 λεπτά από την έναρξη της ληστείας, επιτρέπεται η
                        αποχώρηση.
                      </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-green-500">
                      <h3 className="font-bold text-lg mb-2">Μέγιστα Λύτρα</h3>
                      <div className="text-gray-300">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Απλός Πολίτης: 20.000 $</li>
                          <li>Αστυνομικός: 35.000 $</li>
                          <li>EMS: 30.000 $</li>
                          <li>Διευθυντές EMS/LSPD: 50.000 $</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-green-500">
                      <h3 className="font-bold text-lg mb-2">Στημένοι Όμηροι</h3>
                      <p className="text-gray-300">Η ύπαρξη 'στημένου' ομήρου απαγορεύεται.</p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-green-500">
                      <h3 className="font-bold text-lg mb-2">PvP & Διαπραγματεύσεις</h3>
                      <p className="text-gray-300">
                        Απαγορεύεται το PvP για τον έλεγχο μιας ληστείας και δεν επιτρέπονται troll αιτήματα
                        διαπραγμάτευσης.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
