#!/usr/bin/perl


####	This Script is owned by EIT support
####	This Script use CURL to fetch contents from critical webpages to determine the application availability and performance
####	Input to the script includes the path of file where it has the list of URLs to check 
####	This Script will return a JSON file with the application name, its URL and its status
####	Use your own logic to render the JSON to desired format or load it to a datastore

####	Author : Karthikeyan PM (PKARTHI1)
####	Mail to: karthikeyan.pm@visteon.com
####	Created Date :	22-OCT-2023


# Import the dependencies from the working directory
use Cwd;

use strict;

#my $sec_check;
my $working_dir = cwd;
my $config = $working_dir . "/URLCheck_Config.txt";
my $output = $working_dir . "/tmpoutput.txt";
my $datafile = $working_dir . "/../data/app_url_check.json";

my $curl = "C:\\curl-7.85.0_1-win64-mingw\\bin\\curl"; 	# For Windows mention the CURL from the installed location
#my $curl = "curl";			# For Linux

# cURL related declarations
my $browser_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246";
my $output_format = "Total_Time:%{time_total};http_code:%{http_code};http_version:%{http_version};num_redirects:%{num_redirects}";
print "\nConfig File : " . $config;
print "\nOutput File : " . $output;
print "\nData File   : " . $datafile;
print "\nBrowser Page: " . $browser_agent;

open('FO',">$datafile")||die "\nUnable to open the $datafile file\n";
open('FI',"<$config")||die "Unable to open the config file\n";  ##opening the config file to read

print FO "[\n"; # Open the JSON data
my $iter = 0;
while(<FI>){
	if($_ !~ m/^#/){
		my $line=$_;
		$iter += 1;
		# Read the Application name and URL from the input config file
		chomp($line);
		my @url_app = split(',',$line);
		my $URL = @url_app[0];
		my $application = @url_app[1];
		chomp($URL);
		chomp($application);

		# cURL to the application URL and write the output to a temp file
		`$curl -L --max-time 30 --insecure -A "$browser_agent" -w '$output_format' -s -o /dev/null  --url $URL > "$output"`;  ##Check the URL health and redirect the output
		# Read the status of cURL from the temp output file
		open('FT',"<$output")||die "Unable to open the Temp Output file\n";  ##opening the Temp Output file to the output of cURL
		my $outputStr;
		while(<FT>){
			$outputStr .= $_;
		}
		my %outputHash = split(/[:;]/,$outputStr);
		my $status = "";
		my $response_time = "";

		print "\n---------------------------------------------------------\n";
		print "URL:$URL;\n";
		unless($iter == 1){
			print FO ",\n";
		}
		print FO "\n{\n";	# Open a JSON Record
		print FO "\"URL\":\"$URL\",\n";
		print FO "\"Application\":\"$application\",\n";
		foreach my $param (keys %outputHash){
			print FO "\"$param\":\"$outputHash{$param}\",\n";

			# Translate the HTTP Code to readable status
			if($param eq "http_code"){
				if($outputHash{$param} eq "200"){
					print FO "\"status\":\"Available\",\n";
				}else{
					print FO "\"status\":\"Unavailable\",\n";
				}
			}
		}
		# my $current_date_time_UTC = `time /T;
		my $dateStr = localtime();
		print FO "\"last_verfied_time\":\"$dateStr\"\n";
		print FO "}";	# close a JSON Record
		print "---------------------------------------------------------\n";
		close FT;
	}
sleep(1);
}
print FO "\n]"; # Close the JSON Data
close FI;
close FO;
