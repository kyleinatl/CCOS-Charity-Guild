'use client';

export default function DonorListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="CCOS Charity Guild Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Country Club of the South
                </h1>
                <p className="text-sm text-green-600 font-medium">Charity Guild</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-green-700 hover:text-emerald-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-green-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <a
                href="/"
                className="text-green-700 hover:text-emerald-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-green-50"
              >
                Home
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
            Donor List
          </h2>
        </div>

        {/* 2025 Donors */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100 mb-8">
          <h3 className="text-3xl font-bold text-green-900 mb-2">2025 Donors</h3>
          <p className="text-lg text-green-700 mb-6">List of Donors as of Dec 31, 2025*</p>

          {/* Diamond */}
          <div className="mb-8">
            <h4 className="text-2xl font-bold text-amber-600 mb-4 border-b-2 border-amber-600 pb-2">Diamond ($10,000+)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {['Bradley Keeter', 'Chuck Schneider', 'Kinskey family', 'Suzanne and Richard Schultze'].map((name, i) => (
                <p key={i} className="text-green-800">{name}</p>
              ))}
            </div>
          </div>

          {/* Platinum */}
          <div className="mb-8">
            <h4 className="text-2xl font-bold text-gray-600 mb-4 border-b-2 border-gray-600 pb-2">Platinum Patron ($5,000-$9,999)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {['Cathy and Glen Bradley', 'Chris Burson', 'Shelly and Chris Demetree', 'Melissa Dickens', 'Kristin and Thomas Golub', 'Douglas Ross', 'Beth and Andy Wren'].map((name, i) => (
                <p key={i} className="text-green-800">{name}</p>
              ))}
            </div>
          </div>

          {/* Gold */}
          <div className="mb-8">
            <h4 className="text-2xl font-bold text-yellow-600 mb-4 border-b-2 border-yellow-600 pb-2">Gold Patron ($1,000-$4,999)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {['Jan and Bruce Alonso', 'Mary Baird and David Nelson', 'Judy and John Bardis', 'Becky and Roger Brown', 'Pam and Larry Buckley', 'Joyce and Vince Connolly', 'Mary and Lance Cunha', 'Ruchi and Manish Dave', 'Julia and David DeCook', 'Irma Rodriguez and Fred Fernandez', 'Kerri and Mark Friedman', 'Jennifer and Gary Gabriel', 'Ken Gary', 'Kim and John Gehrhardt', 'Susie and Michael Greenberg', 'Beth Hausmann', 'Candace and Todd Hickman', 'Marjorie and Michael Keith', 'Diane and Michael Koehler', 'Jill and Richard Levine', 'Lani and Richard Lusk', 'Joyce and Larry Mays', 'Jennifer and Barry Meyrowitz', 'Konni and Jon Minter', 'Stephanie and Dan Moody', 'Tracie and Jeff Nolde', 'Lori and Larry Payne', 'Joy and Bill Prettyman', 'Marianne and Winfried Johnson-Rank', 'Zamira and John Rasper', 'Tracy and Michael Reidenbach', 'Julie Samsel', 'Beth and John Scarbrough', 'Pat and Mark Seal', 'Kathy and Scott Solomon', 'Salli LeVan and Michael Steck', 'Barbara and Scott Stevens', 'Halina and Aleksander Szlam', 'Chantel and Rob Taylor', 'LuAnn and Tom Via', 'Rhonda and Russell Welch'].map((name, i) => (
                <p key={i} className="text-green-800">{name}</p>
              ))}
            </div>
          </div>

          {/* Silver */}
          <div className="mb-8">
            <h4 className="text-2xl font-bold text-gray-500 mb-4 border-b-2 border-gray-500 pb-2">Silver Patron ($500-$999)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {['Suzanne and Dennis Antinori', 'Vivienne and Mark Avetoom', 'Tricia and Mike Bennett', 'Kimberly and Clydall Bobb', 'Cynthia and Robert Bowers', 'Karri Bunn Holley', 'Sandie and Craig Cappai', 'Lisa and Tom Chambers', 'Ann Chapman', 'Heidi Cohen-Brugliera and Gary Brugliera', 'Marie and Kyle Cooper', 'Cherlyn and Neal Corbett', 'Marcelle DeCuir', 'Christine and George Fey', 'Kristine and Phil Finkle', 'Barbara Flandreau', 'Susan and Lance Friedland', 'Pam and Pete Gebhardt', 'Donna and Guy Gill', 'Lynn and JP Gingras', 'Tobey and Ed Gray', 'Susie and Michael Greenberg', 'Deirdre and Ken Greenfield', 'Marcy and Paul Hirshberg', 'Tracy and Allen Hobbs', 'Kathy and Rob Hoddeson', 'Elaine and Peter Johns', 'Whitney and Hugh Kaplan', 'Kausar and Michael Kenning', 'Mary Lyn and JB Kurish', 'Jacqueline and Keith Large', 'Allison and Andy Loetscher', 'Sandra and Patrick Marshall', 'Julie Maurer', 'Yvette and Tony Mendez-Norwood', 'Monica and Ric Murray', 'Louise O\'Neill', 'Yara Parada-Aguirre', 'Karishma Kothari and Kushal Patel', 'Jen and Mike Passilla', 'Heather and Tim Perry', 'Romica Raina', 'Stacey Ramani', 'Rebecca and Phil Rochester', 'Brian Rohner', 'Megan and Bob Ross', 'Debbie and Glen Rubin', 'Lynn and Rick Schultz', 'Eileen and Mark Sharitz', 'Stephanie and Andrew Shearer', 'Andrea and Ken Shelton', 'Kristin and Trent Speckhals', 'Jennifer and Chad Streetman', 'Jennifer and Graham Stroman', 'Cathy and Majdi Suleiman', 'Denise Templeton', 'Carolyn and Walter Terry', 'Suzanne and Robert Thomas', 'Anne and Al Tiano', 'Tina and Thomas Tromiczak', 'Sarah Weyl', 'Leslie and Jeff Wilks', 'Betty Wolf and LeRoy Anderson'].map((name, i) => (
                <p key={i} className="text-green-800">{name}</p>
              ))}
            </div>
          </div>

          {/* Hope */}
          <div className="mb-8">
            <h4 className="text-2xl font-bold text-green-600 mb-4 border-b-2 border-green-600 pb-2">Hope ($100-$499)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {['Chenab and Sunny Aiya', 'Kat and Michael Anderson', 'Tammy and Todd Antin', 'Terry and Thomas Backer', 'Amanda and Mike Blackwelder', 'Andee Blauser', 'Susan Sullivan and Doug Bonk', 'Jennifer and Nate Browne', 'Barbara Young and Bennett Bruckner', 'Julie and Warren Carson', 'Dana Cochran', 'Randolph Cochran', 'Pam and Bill Curtice', 'Sonya Dane', 'Monica Davis and Richard Alford', 'Ellie and Christopher Deedy', 'Claire Demetree', 'Phillip Dopson', 'Bradley Ellis', 'Sue and Steve Foege', 'Catherine Foley', 'Maggie Goldman', 'Cathy and Bill Johnston', 'Carla and Grantley Joseph', 'Mary Beth Kennedy', 'Ryann and Scott Kennedy', 'Lauren Kermani', 'Sissy and Michael Luciani', 'Erin and Brian McCarthy', 'Meghan and Kam McCarthy', 'Marla and Greg Milano', 'Colleen Nilan', 'Marissa Pendegraft', 'Rebecca and Kevin Polli', 'Jennifer and David Ray', 'Nancy and Marion Rhine', 'Bridget and David Rickey', 'Ramon Rodriguez', 'Kevin Ryan', 'Melanie Sanders', 'Eileen and Mark Sharitz', 'Anu and Lokendra Sheth', 'Ann and Jesse Seidman', 'Paulette and Carter Simpson', 'Beth and Jonathan Speigner', 'Carter Spriggs', 'Holly and Rami Suleiman', 'Dee and Jay Vallee', 'Nicole Vereen and Steve Siegner', 'Gina and Sharad Virmani', 'Mike Wells'].map((name, i) => (
                <p key={i} className="text-green-800">{name}</p>
              ))}
            </div>
          </div>
        </div>

        {/* 2024 Donors */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100">
          <h3 className="text-3xl font-bold text-green-900 mb-2">2024 Donors</h3>
          <p className="text-lg text-green-700 mb-6">List of Donors as of Dec 31, 2024*</p>

          <h4 className="text-2xl font-bold text-green-800 mb-6">Patrons ($500+)</h4>

          {/* Diamond */}
          <div className="mb-8">
            <h5 className="text-xl font-bold text-amber-600 mb-4 border-b-2 border-amber-600 pb-2">Diamond Patron ($10,000+)</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {['Bradley Keeter', 'Kinskey family', 'Chuck Schneider', 'Suzanne and Richard Schultze'].map((name, i) => (
                <p key={i} className="text-green-800">{name}</p>
              ))}
            </div>
          </div>

          {/* Gold */}
          <div className="mb-8">
            <h5 className="text-xl font-bold text-yellow-600 mb-4 border-b-2 border-yellow-600 pb-2">Gold Patron ($5,000-$9,999)</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {['Judy and John Bardis', 'Cathy and Glen Bradley', 'Melissa Dickens', 'Kristin and Tom Golub', 'Betsy and Rod Odom', 'Marianne and Winfried Johnson-Rank', 'Beth and Andy Wren'].map((name, i) => (
                <p key={i} className="text-green-800">{name}</p>
              ))}
            </div>
          </div>

          {/* Ruby */}
          <div className="mb-8">
            <h5 className="text-xl font-bold text-red-600 mb-4 border-b-2 border-red-600 pb-2">Ruby Patron ($2,500-$4,999)</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {['Chris Burson', 'Julia and David DeCook', 'Beth and John Scarbrough', 'Halina and Aleksander Szlam'].map((name, i) => (
                <p key={i} className="text-green-800">{name}</p>
              ))}
            </div>
          </div>

          {/* Silver */}
          <div className="mb-8">
            <h5 className="text-xl font-bold text-gray-500 mb-4 border-b-2 border-gray-500 pb-2">Silver Patron ($1,000-$2,499)</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {['Jan and Bruce Alonso', 'Mary Baird and David Nelson', 'Catherine and Tom Borbone', 'Heidi Cohen-Brugliera and Gary BrugulieraIssure Chen', 'Joyce and Vince Connolly', 'Mary and Lance Cunha', 'Jennifer and Gary Gabriel', 'Ken Gary', 'Kim and John Gehrhardt', 'Susie and Michael Greenberg', 'Beth Hausmann', 'Candace and Todd Hickman', 'Marcy and Paul Hirshberg', 'Tracy and Allen Hobbs', 'Elaine and Peter Johns', 'Philip Jones', 'Marjorie and Michael Keith', 'Diane and Michael Koehler', 'Jill and Richard Levine', 'Lani and Richard Lusk', 'Joyce and Larry Mays', 'Jennifer and Barry Meyrowitz', 'Konni and Jon Minter', 'Stephanie and Dan Moody', 'Judy and Bob Murphy', 'Tracie and Jeff Nolde', 'Carol and Van Page', 'Lori and Larry Payne', 'Marissa Pendegraft', 'Zamira and John Rasper', 'Tracy and Michael Reidenbach', 'Irma Rodriguez and Fred Fernandez', 'Pat and Mark Seal', 'Kathy and Scott Solomon', 'Barbara and Scott Stevens', 'Jennifer and Graham Stroman', 'Louise and William Tallman', 'LuAnn and Tom Via', 'Rhonda and Russe Welch'].map((name, i) => (
                <p key={i} className="text-green-800">{name}</p>
              ))}
            </div>
          </div>

          {/* Hope */}
          <div className="mb-8">
            <h5 className="text-xl font-bold text-green-600 mb-4 border-b-2 border-green-600 pb-2">Hope Patron ($500-$999)</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {['Katherine and Michael Anderson', 'Suzanne and Dennis Antinori', 'Vivienne and Mark Avetoom', 'Tricia and Mike Bennett', 'Kimberly and Clydall Bobb', 'Cynthia and Robert Bowers', 'Meredith and Matt Brohm', 'Becky and Roger Brown', 'Rachael Cassidy + Tracy Brown', 'Pam and Larry Buckley', 'Lisa and Tom Chambers', 'Ann Chapman', 'Peggy and Paul Connors', 'Cherlyn and Neal Corbett', 'Ruchi and Manish Dave', 'Stephanie and Gary Dennis', 'Geri and Gary Eubanks', 'Christine and George Fey', 'Kristine and Phil Finkle', 'Barbara Flandreau', 'Susan and Lance Friedland', 'Pam and Pete Gebhardt', 'Donna and Guy Gill', 'Lynn and JP Gingras', 'Tobey and Ed Gray', 'Kerri and Brian Holmes', 'Andrea and Chris Johnson', 'Whitney and Hugh Kaplan', 'Mary Lyn and JB Kurish', 'Jacqueline and Keith Large', 'Allison and Andy Loetscher', 'Sylvia and Mike Lundberg', 'Lynne and Gene Magurno', 'Sandra and Patrick Marshall', 'Julie Maurer', 'Yvette and Tony Mendez-Norwood', 'Donna and Wes Mize', 'Vanessa and Frank Nguyen', 'Vallee and Robert Ohayon', 'Louise O\'Neill', 'Yara Parada-Aguirre', 'Karishma Kothari and Kushal Patel', 'Heather and Tim Perry', 'Linda and Charles Phillips', 'Joy and Bill Prettyman', 'Stacey Ramani', 'Joseph Riccardo', 'Vickie Riccardo and Billy Nicholson', 'Bridget and David Rickey', 'Brian Rohner', 'Megan and Bob Ross', 'Debbie and Glen Rubin', 'Lynn and Rick Schultz', 'Eileen and Mark Sharitz', 'Stephanie and Andrew Shearer', 'Andrea and Ken Shelton', 'Kristin and Trent Speckhals', 'Salli LeVan and Michael Steck', 'Shelley and Dale Stortz', 'Jennifer and Chad Streetman', 'Jane Fershko-Taylor and Gary Taylor', 'Carolyn and Walter Terry', 'Suzanne and Robert Thomas', 'Anne and Al Tiano', 'Tina and Thomas Tromiczak', 'Dee and Jay Vallee', 'Ana Vargas', 'Karen and Mark Whaley', 'Leslie and Jeff Wilks', 'Betty Wolf and LeRoy Anderson'].map((name, i) => (
                <p key={i} className="text-green-800">{name}</p>
              ))}
            </div>
          </div>

          {/* Members */}
          <div className="mb-8">
            <h5 className="text-xl font-bold text-emerald-600 mb-4 border-b-2 border-emerald-600 pb-2">Members ($100-$499)</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {['Tammy and Todd Antin', 'Terry and Thomas Backer', 'Andee Blauser', 'Becky and Roger Brown', 'Jennifer and Nate Browne', 'Marie Cooper', 'Samantha and Andrew Cooper', 'Caroline and Ron Cruz', 'Pam and Bill Curtice', 'Phillip Dopson', 'Gail and Gary Dowling', 'Family Dugan', 'Bradley Ellis', 'Susan and Ted Glahn', 'Sharon and Rob Glazier', 'Deirdre and Ken Greenfield', 'Katie and Jeff Hopeck', 'Leah and Tim Johnson', 'Lauren Kermani', 'Lynn Lanier', 'Sissy and Michael Luciani', 'Erin and Brian McCarthy', 'Kevin McCarthy', 'Laura Miller', 'Barbara and Carlos Miramontes', 'Jennifer and Steve Oliveras', 'Joan Postell', 'Kalpana Prasad', 'Nancy and Marlon Rhine', 'Marian Ross', 'Zaquis and Zachary Ross', 'Kim and Chris Schweitzer', 'Nicole and John Schweizer', 'Ruchika Sethi', 'Amy Shackelford', 'Paulette and Carter Simpson', 'Sunali and Kush Singh', 'Beth and Jonathan Speigner', 'Carter Spriggs', 'Kristen and David Stinson', 'Nicole Vereen and Steve Siegner', 'Susan Sullivan and Doug Bonk', 'Denise Templeton', 'Greg Tremble', 'Gina and Sharad Virmani', 'Stuart Voigts', 'Niki and Kip Wagner', 'Kathy and Ed Young'].map((name, i) => (
                <p key={i} className="text-green-800">{name}</p>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
