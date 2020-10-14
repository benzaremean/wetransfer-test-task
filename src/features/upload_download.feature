Feature: Upload and Download

    As a user
    I should be able to send files

    Background: Set sender and recipient
      Given sender with email "jaminonline@gmail.com"
      And recipient with email "jaminonline@gmail.com"
      
    Scenario: Should be able to send single file
      When I log in as sender
      And I upload the following files:
        | shell.mp4 |
      Then the files should be uploaded successfully
      When I log in as recipient
      Then the sent files should be available for download
      When the recipient triggers download
      Then the "shell.mp4" file should be downloaded successfully

    Scenario: Should be able to send multiple files
      When I log in as sender
      And I upload the following files:
        | dummy.pdf |
        | Mozilla_Firefox.png |
        | shell.mp4 |
      Then the files should be uploaded successfully
      When I log in as recipient
      Then the sent files should be available for download
      When the recipient triggers download
      Then a compressed file containing files should be downloaded successfully

