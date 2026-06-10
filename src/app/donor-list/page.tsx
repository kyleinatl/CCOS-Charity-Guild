'use client';

const donorSections = [
  {
    year: '2026 Donors',
    subtitle: 'List of Donors as of June 7, 2026*',
    content: `Diamond ($10,000+)
Chuck Schneider
Suzanne and Richard Schultze
Ana Vargas

Platinum Patron ($5,000-$9,999)
Cathy and Glen Bradley
Shelly and Chris Demetree
Melissa Dickens
Kristin and Thomas Golub
Kristin and Brian Harms
Beth and Andy Wren

Gold ($1000-$4,999)
Jan and Bruce Alonso
Bridget Barfield
Mary Baird and David Nelson
Pam and Larry Buckley
Chris Burson
Joyce and Vince Connolly
Mary and Lance Cunha
Ruchi and Manish Dave
Julia and David DeCook
Irma Rodriguez and Fred Fernandez
Jennifer and Gary Gabriel
Kim and John Gehrhardt
Julie Samsel and Benjamin Grimes
Patrica Grimes
Candace and Todd Hickman
Marjorie and Michael Keith
Diane and Michael Koehler
Suzanne Kolb
Sally Levan and Michael Steck
Jill and Richard Levine
Lani and Richard Lusk
Vanessa and Kirk Mason
Joyce and Larry Mays
Jennifer Meyrowitz
Meg Middleton
Tracie and Jeff Nolde
Louise O'Neill
Lori and Larry Payne
K Lee Sherman and John Perkins
Stacey Ramani
Tracy and Michael Reidenbach
Glen and Debbie Rubin
Pam and Bryant Scott
Pat and Mark Seal
Halina and Aleksander Szlam
Louise and William Tallman
Chantel and Rob Taylor
LuAnn and Tom Via
Rhonda and Russ Welch
Leslie and Jeff Wilks
Katherine and Ed Young

Silver Patron ($500-$999)
Christine Abbate
Suzanne and Dennis Antinori
Avinesh Bhar
Maureen Anderson
Judy and John Bardis
James Callahan
Lisa and Tom Chambers
Dana and Rob Cochran
Peggy and Paul Connors
Cherlyn and Neal Corbett
Ellie and Christopher Deedy
Christine and George Fey
Kristine and Phil Finkle
Susan and Lance Friedland
Pam and Pete Gebhardt
Donna and Guy Gill
Lynn and JP Gingras
Tobey and Ed Gray
Marcy and Paul Hirshberg
Elaine and Peter Johns
Whitney and Hugh Kaplan
Gol and Clint Kimbrell
Mary Lynn and JB Kurish
Sissy and Michael Luciani
Lynne and Gene Magurno
Melinda Marshall
Sandra and Patrick Marshall
Connie and Jim McGinley
Paula and George Norton
Yvette and Tony Norwood
Joy and Bill Prettyman
Claire Quinn
Romica Raina
Brian Rohner
Debbie and Glen Rubin
Jaclyn and John Scarbrough
Eileen and Mark Sharitz
Andrea and Ken Shelton
Lokendra and Anu Sheth
Kristen and Trent Speckhals
Kent and Pam Starke
Shelley and Dale Stortz
Jennifer and Chad Streetman
Jennifer and Graham Stroman
Carolyn and Walter Terry
Suzanne and Bob Thomas

Member ($100-$499)
Betty Wolf and LeRoy Anderson
Tammy and Todd Antin
Erin and Andrew Armour
Terry and Thomas Backer
Amanda and Mike Blackwelder
Andee Blauser
Susan Sullivan and Doug Bonk
Kim and Kevin Bryan
Michelle and Ross Carlson
Karen Cox
Caroline and Ron Cruz
Pam and Bill Curtice
Heather and Bryan Davis
Margaret Demetree
Pamela DeRitis
Sue and Steve Foege
Lyn and Bob Isaacs
Catherine and Bill Johnston
Wendy and Bob King
Rebecca Kozycki
Erin and Brian McCarthy
Barbara and Carlos Miramontes
Rebecca and Kevin Polli
Kristyn and Albert Rees
Louise Scott
Kirsten and David Stinson
Joan Postell and Lee Trexler
Bridget and David Rickey
Ramon Rodriguez
Dee and Jay Vallee`,
  },
  {
    year: '2025 Donors',
    subtitle: 'List of Donors as of Dec 31, 2025*',
    content: `Diamond ($10,000+)
Bradley Keeter
Chuck Schneider
Kinskey family
Suzanne and Richard Schultze

Platinum Patron ($5,000-$9,999)
Cathy and Glen Bradley
Shelly and Chris Demetree
Melissa Dickens
Kristin and Thomas Golub
Douglas Ross
Beth and Andy Wren

Gold Patron ($1,000-$4,999)
Jan and Bruce Alonso
Mary Baird and David Nelson
Judy and John Bardis
Becky and Roger Brown
Pam and Larry Buckley
Chris Burson
Joyce and Vince Connolly
Mary and Lance Cunha
Ruchi and Manish Dave
Julia and David DeCook
Irma Rodriguez and Fred Fernandez
Kerri and Mark Friedman
Jennifer and Gary Gabriel
Ken Gary
Kim and John Gehrhardt
Susie and Michael Greenberg
Beth Hausmann
Candace and Todd Hickman
Marjorie and Michael Keith
Diane and Michael Koehler
Jill and Richard Levine
Lani and Richard Lusk
Joyce and Larry Mays
Jennifer and Barry Meyrowitz
Konni and Jon Minter
Stephanie and Dan Moody
Tracie and Jeff Nolde
Carol and Van Page
Lori and Larry Payne
Joy and Bill Prettyman
Marianne and Winfried Johnson-Rank
Zamira and John Rasper
Tracy and Michael Reidenbach
Julie Samsel and Benjamin Grimes
Beth and John Scarbrough
Pat and Mark Seal
Kathy and Scott Solomon
Salli LeVan and Michael Steck
Barbara and Scott Stevens
Halina and Aleksander Szlam
Chantel and Rob Taylor
LuAnn and Tom Via
Rhonda and Russell Welch

Silver Patron ($500-$999)
Suzanne and Dennis Antinori
Vivienne and Mark Avetoom
Tricia and Mike Bennett
Kimberly and Clydall Bobb
Cynthia and Robert Bowers
Karri Bunn Holley
Sandie and Craig Cappai
Lisa and Tom Chambers
Ann Chapman
Heidi Cohen-Brugliera and Gary Brugliera
Marie and Kyle Cooper
Cherlyn and Neal Corbett
Marcelle DeCuir
Christine and George Fey
Kristine and Phil Finkle
Barbara Flandreau
Susan and Lance Friedland
Pam and Pete Gebhardt
Donna and Guy Gill
Lynn and JP Gingras
Tobey and Ed Gray
Susie and Michael Greenberg
Deirdre and Ken Greenfield
Marcy and Paul Hirshberg
Tracy and Allen Hobbs
Kathy and Rob Hoddeson
Elaine and Peter Johns
Whitney and Hugh Kaplan
Kausar and Michael Kenning
Mary Lyn and JB Kurish
Jacqueline and Keith Large
Allison and Andy Loetscher
Sandra and Patrick Marshall
Julie Maurer
Yvette and Tony Mendez-Norwood
Monica and Ric Murray
Louise O'Neill
Yara Parada-Aguirre
Karishma Kothari and Kushal Patel
Jen and Mike Passilla
Heather and Tim Perry
Romica Raina
Stacey Ramani
Rebecca and Phil Rochester
Brian Rohner
Megan and Bob Ross
Debbie and Glen Rubin
Lynn and Rick Schultz
Eileen and Mark Sharitz
Anu and Lokendra Sheth
Stephanie and Andrew Shearer
Andrea and Ken Shelton
Kristin and Trent Speckhals
Shelley and Dale Stortz
Jennifer and Chad Streetman
Jennifer and Graham Stroman
Cathy and Majdi Suleiman
Denise Templeton
Carolyn and Walter Terry
Suzanne and Robert Thomas
Anne and Al Tiano
Tina and Thomas Tromiczak
Sarah Weyl
Leslie and Jeff Wilks
Betty Wolf and LeRoy Anderson

Hope ($100-$499)
Chenab and Sunny Aiya
Kat and Michael Anderson
Tammy and Todd Antin
Terry and Thomas Backer
Amanda and Mike Blackwelder
Andee Blauser
Susan Sullivan and Doug Bonk
Jennifer and Nate Browne
Barbara Young and Bennett Bruckner
Julie and Warren Carson
Dana Cochran
Randolph Cochran
Pam and Bill Curtice
Sonya Dane
Monica Davis and Richard Alford
Ellie and Chris Deedy
Claire Demetree
Phillip Dopson
Bradley Ellis
Sue and Steve Foege
Catherine Foley
Maggie Goldman
Cathy and Bill Johnston
Carla and Grantley Joseph
Mary Beth Kennedy
Ryann and Scott Kennedy
Lauren Kermani
Sissy and Michael Luciani
Erin and Brian McCarthy
Meghan and Kam McCarthy
Marla and Greg Milano
Colleen Nilan
Marissa Pendegraft
Rebecca and Kevin Polli
Jennifer and David Ray
Nancy and Marion Rhine
Bridget and David Rickey
Ramon Rodriguez
Kevin Ryan
Melanie Sanders
Eileen and Mark Sharitz
Anu and Lokendra Sheth
Ann and Jesse Seidman
Paulette and Carter Simpson
Beth and Jonathan Speigner
Carter Spriggs
Holly and Rami Suleiman
Dee and Jay Vallee
Nicole Vereen and Steve Siegner
Gina and Sharad Virmani
Mike Wells`,
  },
];

export default function DonorListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-sky-100">
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <img
                src="/ccos-logo-transparent.png"
                alt="CCOS Charity Guild Logo"
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent">
                  Country Club of the South
                </h1>
                <p className="text-sm text-blue-600 font-medium">Charity Guild</p>
              </div>
            </div>
            <a
              href="/"
              className="text-blue-700 hover:text-sky-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              Home
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent mb-4">
            Donor List
          </h2>
          <p className="text-blue-700 text-sm sm:text-base">
            Live donor roster copied from the current Charity Guild donor list and presented locally.
          </p>
        </div>

        {donorSections.map((section) => (
          <section key={section.year} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-100">
            <h3 className="text-3xl font-bold text-blue-900 mb-2">{section.year}</h3>
            <p className="text-lg text-blue-700 mb-6">{section.subtitle}</p>
            <pre className="whitespace-pre-wrap text-sm sm:text-[15px] leading-7 text-slate-800 font-sans">{section.content}</pre>
          </section>
        ))}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/donate"
            className="inline-flex justify-center bg-gradient-to-r from-blue-600 to-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-sky-700 transition-all shadow-lg hover:shadow-xl"
          >
            Back to Donate
          </a>
          <a
            href="/contact"
            className="inline-flex justify-center bg-gradient-to-r from-[#e5c366] to-[#d4b356] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#d4b356] hover:to-[#c4a346] transition-all shadow-lg hover:shadow-xl"
          >
            Contact the Board
          </a>
        </div>
      </main>
    </div>
  );
}
